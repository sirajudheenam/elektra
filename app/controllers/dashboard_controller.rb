# frozen_string_literal: true

# This class guarantees that the user is logged in and his token is rescoped.
# All subclasses which require a logged in user should inherit from this class.
class DashboardController < ::ScopeController
  include UrlHelper

  prepend_before_action do
    requested_url = request.env['REQUEST_URI']
    referer_url = request.referer
    referer_url = begin
      "#{URI(referer_url).path}?#{URI(referer_url).query}"
    rescue
      nil
    end

    unless params[:after_login]
      params[:after_login] = if requested_url =~ /(\?|\&)modal=true/ &&
          referer_url =~ /(\?|\&)overlay=.+/
                               referer_url
                             else
                               requested_url
                             end
    end
  end

  before_action :load_help_text

  # authenticate user -> current_user is available
  # throws only errors
  #api_authentication_required domain: ->(c) { c.instance_variable_get(:@scoped_domain_id) },
  #                        domain_name: ->(c) { c.instance_variable_get(:@scoped_domain_name) },
  #                        project: ->(c) { c.instance_variable_get(:@scoped_project_id) },
  #                        rescope: false,
  #                        two_factor: :two_factor_required?,
  #                        except: :terms_of_use

  # with redirect
  authentication_required domain: ->(c) { c.instance_variable_get(:@scoped_domain_id) },
                          domain_name: ->(c) { c.instance_variable_get(:@scoped_domain_name) },
                          project: ->(c) { c.instance_variable_get(:@scoped_project_id) },
                          rescope: false,
                          two_factor: :two_factor_required?,
                          except: :terms_of_use

  # after_login is used by monsoon_openstack_auth gem.
  # After the authentication process has finished the
  # after_login can be removed.
  before_action { params.delete(:after_login) }

  # check if user has accepted terms of use.
  # Otherwise it is a new, unboarded user.
  before_action :check_terms_of_use, except: %i[accept_terms_of_use terms_of_use]
  # rescope token
  before_action :rescope_token, except: [:terms_of_use]
  before_action :raven_context, except: [:terms_of_use]
  before_action :load_active_project,
                :load_webcli_endpoint, except: %i[terms_of_use]
  before_action :set_mailer_host

  # GLOBAL ERROR RESCUE && HANDLING
  ##############################
  # handle Missing Template
  rescue_from 'ActionView::MissingTemplate' do |exception|
    options = {
      warning: true, sentry: true,
      title: 'Page not Found',
      description: "The page you are looking for doesn't exist. Please verify the url"

    }
    render_exception_page(exception, options.merge(sentry: true))
  end

  # handle Token issues
  rescue_from 'Elektron::Errors::TokenExpired',
              'ActionController::InvalidAuthenticityToken' do | exception |
    redirect_to monsoon_openstack_auth.login_path(
      domain_fid: @scoped_domain_fid,
      domain_name: @scoped_domain_name, after_login: params[:after_login]
    )
  end

  # handle NotAuthorized but NOTE! this should never fetch because all errors related to 
  # "MonsoonOpenstackAuth::Authentication::NotAuthorized" are rescued directly in rescope_token and handled by 
  # "rescue_and_render_exception_page" but I leave it here just in case ;-) 
  rescue_from 'MonsoonOpenstackAuth::Authentication::NotAuthorized' do | exception |
    # for project "has no access to project"
    # check MonsoonOpenstackAuth/Authentication/auth_session.rb
    if exception.message =~ /has no access to project/
      render(template: 'application/exceptions/unauthorized')
    else
      redirect_to monsoon_openstack_auth.login_path(
        domain_fid: @scoped_domain_fid,
        domain_name: @scoped_domain_name, after_login: params[:after_login]
      )
    end
  end

  # handle all api errors
  rescue_from 'Elektron::Errors::ApiResponse' do |exception|
    options = {
      title: exception.code_type, description: :message,
      warning: true, sentry: true
    }

    case exception.code.to_i
    # when 407 # Authentication required
    #   # ignore this error here. It should be caught by
    #   # Elektron::Errors::TokenExpired rescue.
    #   # Most likely this is the cause of double render error!
    #   return
    when 401 # unauthorized
      redirect_to monsoon_openstack_auth.login_path(
        domain_fid: @scoped_domain_fid,
        domain_name: @scoped_domain_name, after_login: params[:after_login]
      )

    when 404 # not found
      options[:title] = 'Object not Found'
      options[:description] = "The object you are looking for doesn't exist. \
      Please verify your input. (#{exception.message})"
      render_exception_page(exception, options.merge(sentry: true))
    when 403 # forbidden
      options[:title] = 'Permission Denied'
      options[:description] = exception.message ||
                              'You are not authorized to request this page.'
      render_exception_page(exception, options.merge(sentry: true))
    when 429 # too many requests
      options[:title] = 'Too Many Requests'
      options[:description] = exception.message ||
                              'You have made too many requests to identity. Please try again later.'
      render_exception_page(exception, options.merge(sentry: true))
    when 501 # Not implemented
      options[:title] = 'Not Implemented'
      options[:description] = exception.message ||
                              'The requested functionality is not supported.'
      render_exception_page(exception, options.merge(sentry: true))
    end
  end

  # catch all mentioned errors that are note handled and render error page
  rescue_and_render_exception_page [
    {
      'MonsoonOpenstackAuth::Authorization::SecurityViolation' => {
        title: 'Unauthorized',
        sentry: false,
        warning: true,
        status: 401,
        description: lambda do |e, _c|
          m = 'You are not authorized to view this page.'
          if e.involved_roles && e.involved_roles.length.positive?
            m += " Please check (role assignments) if you have one of the \
          following roles: #{e.involved_roles.flatten.join(', ')}."
          end
          m
        end
      }
    },
    { 'Core::Error::ProjectNotFound' => {
      title: 'Project Not Found', sentry: false, warning: true
    } }
  ]

  # this method checks if user has permissions for the new scope and if so
  # it rescopes the token.
  def rescope_token
    if @scoped_project_id
      # @scoped_project_id exists -> check if friendly id for this project
      # also exists. The scope controller runs bevore this controller and
      # updates the friendlyId entry if project exists.
      unless FriendlyIdEntry.find_project(@scoped_domain_id, @scoped_project_id)
        # friendly id entry is nil -> reset @can_access_project, render project
        # not found page and return.
        @can_access_project = false
        return render(template: 'application/exceptions/project_not_found')
      end

      # NOTE: LEAVE this here because for better review
      # we do not need extra permissions check for project and domains because elektron and monsoon_openstack_auth
      # are doing the job. If the user has no access with his token monsoon_openstack_auth will trow an NotAuthorized
      # error that we will catch and handle to show 'application/exceptions/unauthorized'
      # 
      # if no access this is handled in rescue from above
      # did not return -> check if user projects include the requested project.
      #has_project_access = services.identity.has_project_access(
      #  @scoped_project_id
      #)

      #unless has_project_access
      #  # user has no permissions for requested project -> reset
      #  # @can_access_project, render unauthorized page and return.
      #  @can_access_project = false
      #  return render(template: 'application/exceptions/unauthorized')
      #end
    elsif @scoped_domain_id 
      # NOTE: LEAVE hit here because for better review
      # @scoped_project_id is nil and @scoped_domain_id exists -> check if
      # user can access the requested domain.

      # check if user has access to current domain, add rescue nil for cases where the token scope inexplicably contains a deleted project
      # without the rescue this call leads to an error message and the user can't see the domain page
      #has_domain_access = services.identity.has_domain_access(@scoped_domain_id) rescue nil

      #unless has_domain_access
      #  # this can happen if the user is using a link to  some domain and project
      #  # user has no permissions for the new domain -> rescope to
      #  # unscoped token and return this will be the startpoint to rescope again
      #  return authentication_rescope_token(domain: nil, project: nil)
      #end
    else 
      # both @scoped_project_id and @scoped_domain_id are nil
      # -> render unauthorized page and return.
      @can_access_project = false
      return render(template: 'application/exceptions/unauthorized')
    end
    # did not return yet -> rescope token to the 'new' scope.
    begin
      authentication_rescope_token 
    rescue MonsoonOpenstackAuth::Authentication::NotAuthorized => exception
      if exception.message =~ /has no access to project/
        render(template: 'application/exceptions/unauthorized')
      elsif exception.message =~ /has no access to domain/
        authentication_rescope_token(domain: nil, project: nil)
      end
      # All other NotAuthorized Errors handled by "rescue_and_render_exception_page"
    end
  end

  def check_terms_of_use
    return if tou_accepted?
    render action: :accept_terms_of_use && return
  end

  def accept_terms_of_use
    if params[:terms_of_use]
      # user has accepted terms of use -> onboard user
      UserProfile.create_with(name: current_user.name,
                              email: current_user.email,
                              full_name: current_user.full_name)
                 .find_or_create_by(uid: current_user.id)
                 .domain_profiles.create(
                   domain_id: current_user.user_domain_id,
                   tou_version: Settings.actual_terms.version
                 )
      reset_last_request_cache
      # redirect to domain path
      if plugin_available?('identity')
        redirect_to main_app.domain_home_path(domain_id: @scoped_domain_fid)
      else
        redirect_to main_app.root_path
      end
    else
      check_terms_of_use
    end
  end

  def terms_of_use
    if current_user
      @tou = UserProfile.tou(current_user.id,
                             current_user.user_domain_id,
                             Settings.actual_terms.version)
    end
    render action: :terms_of_use
  end

  def two_factor_required?
    if ENV['TWO_FACTOR_AUTH_DOMAINS']
      return ENV['TWO_FACTOR_AUTH_DOMAINS'].gsub(/\s+/, '').split(',').include?(@scoped_domain_name)
    end
    false
  end

  protected

  helper_method :release_state

  # Overwrite this method in your controller if you want to set the release
  # state of your plugin to a different value. A tag will be displayed in
  # the main toolbar next to the page header
  # DON'T OVERWRITE THE VALUE HERE IN THE DASHBOARD CONTROLLER
  # Possible values:
  # ----------------
  # "public_release"  (plugin is properly live and works, default)
  # "experimental"    (for plugins that barely work or don't work at all)
  # "tech_preview"    (early preview for a new feature that probably still
  #                    has several bugs)
  # "beta"            (if it's almost ready for public release)
  def release_state
    'public_release'
  end

  def show_beta?
    params[:betafeatures] == 'showme'
  end

  helper_method :show_beta?

  def raven_context
    @sentry_user_context = {
      ip_address: request.ip,
      id: current_user.id,
      email: current_user.email,
      username: current_user.name,
      domain: current_user.user_domain_name,
      name: current_user.full_name
    }.reject { |_, v| v.nil? }

    Raven.user_context(@sentry_user_context)

    tags = {}
    tags[:request_id] = request.uuid if request.uuid
    tags[:plugin] = plugin_name if try(:plugin_name).present?
    if current_user.domain_id
      tags[:domain_id] = current_user.domain_id
      tags[:domain_name] = current_user.domain_name
    elsif current_user.project_id
      tags[:project_id] = current_user.project_id
      tags[:project_name] = current_user.project_name
      tags[:project_domain_id] = current_user.project_domain_id
      tags[:project_domain_name] = current_user.project_domain_name
    end
    @sentry_tags_context = tags
    Raven.tags_context(tags)
  end

  def load_active_project
    return unless @scoped_project_id
    # load active project. Try first from ObjectCache and then from API
    cached_active_project = ObjectCache.where(id: @scoped_project_id).first
    if cached_active_project
      @active_project = Identity::Project.new(services.identity, cached_active_project.payload)
    else
      @active_project = service_user.identity.find_project(@scoped_project_id)
    end

    return if @active_project && @active_project.name == @scoped_project_name

    @active_project = services.identity.find_project(
      @scoped_project_id, subtree_as_ids: true, parents_as_ids: true
    )
    FriendlyIdEntry.update_project_entry(@active_project)
  end

  def load_webcli_endpoint
    @webcli_endpoint = current_user.service_url('webcli')
  end

  def tou_accepted?
    # Consider that every plugin controller inhertis from dashboard controller
    # and check_terms_of_use method is called on every request.
    # In order to reduce api calls we cache the result of new_user?
    # in the session for 5 minutes.
    is_cache_expired = current_user.id != session[:last_user_id] ||
        session[:last_request_timestamp].nil? ||
        (session[:last_request_timestamp] < Time.now - 5.minute)
    if is_cache_expired
      session[:last_request_timestamp] = Time.now
      session[:last_user_id] = current_user.id
      session[:tou_accepted] = UserProfile.tou_accepted?(
        current_user.id, current_user.user_domain_id,
        Settings.actual_terms.version
      )
    end
    session[:tou_accepted]
  end

  def reset_last_request_cache
    session[:last_request_timestamp] = nil
    session[:last_user_id] = nil
  end

  def set_mailer_host
    ActionMailer::Base.default_url_options[:host] = request.host_with_port
    ActionMailer::Base.default_url_options[:protocol] = request.protocol
  end

  def project_id_required
    return unless params[:project_id].blank?
    raise Core::Error::ProjectNotFound,
          'The project you have requested was not found.'
  end

  def load_help_text
    plugin_path = params[:controller]

    plugin_index = Core::PluginsManager.available_plugins.find_index do |p|
      plugin_path.starts_with?(p.name)
    end

    unless plugin_index.blank?
      plugin = Core::PluginsManager.available_plugins.fetch(plugin_index, nil)
    end

    return if plugin.blank?

    # get name of the specific service inside the plugin
    # remove plugin name from path
    path = plugin_path.split('/')
    path.shift
    service_name = path.join('_')

    # try to find the help file, check first for service specific help file,
    # next for general plugin help file
    help_file = File.join(plugin.path, "plugin_#{service_name}_help.md")
    unless File.exist?(help_file)
      help_file = File.join(plugin.path, 'plugin_help.md')
    end

    # try to find the links file, check first for service specific links file,
    # next for general plugin links file
    help_links = File.join(plugin.path, "plugin_#{service_name}_help_links.md")
    unless File.exist?(help_links)
      help_links = File.join(plugin.path, 'plugin_help_links.md')
    end

    # load plugin specific help text
    @plugin_help_text = File.new(help_file, 'r').read if File.exist?(help_file)
    return unless File.exist?(help_links)
    # load plugin specific help links
    @plugin_help_links = File.new(help_links, 'r').read
    @plugin_help_links = @plugin_help_links.gsub('#{@sap_docu_url}',
                                                 sap_url_for('documentation'))
  end
end
