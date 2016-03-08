module ObjectStorage
  class ContainersController < ObjectStorage::ApplicationController
    
    authorization_required
    before_filter :load_container, except: [ :index, :new, :create ]

    def index
      @containers   = services.object_storage.containers
      @capabilities = services.object_storage.capabilities
    end

    def show
      # for the "Object versioning" feature, we need to offer a selection of container names,
      # but to avoid confusion, the archive container should be different from the current one
      @other_container_names = services.object_storage.containers.map(&:name).reject { |n| n == @container.name }
    end

    def confirm_deletion
      @form = ObjectStorage::Forms::ConfirmContainerAction.new()
      @empty = @container.empty?
    end

    def confirm_emptying
      @form = ObjectStorage::Forms::ConfirmContainerAction.new()
      @empty = @container.empty?
    end

    def show_access_control
    end

    def update_access_control
      attrs = params.require(:container).permit(:read_acl, :write_acl)
      unless @container.update_attributes(attrs)
        render action: 'show_access_control'
        return
      end
      back_to_container_list
    end

    def new
      @container = services.object_storage.new_container(name: "")
    end

    def empty
      @form = ObjectStorage::Forms::ConfirmContainerAction.new(params.require(:forms_confirm_container_action))
      unless @form.validate
        render action: 'confirm_emptying'
        return
      end
      @container.empty!
      back_to_container_list
    end

    def create
      @container = services.object_storage.new_container(params.require(:container))
      unless @container.save
        render action: 'new'
        return
      end

      back_to_container_list
    end

    def show
    end

    def update
      @container.metadata = self.metadata_params
      attrs = params.require(:container).permit(:object_count_quota, :bytes_quota, :versions_location, :has_versions_location)

      if attrs.delete(:has_versions_location) != '1'
        attrs[:versions_location] = '' # disable versions_location if unselected in UI
      end

      unless @container.update_attributes(attrs)
        @other_container_names = services.object_storage.containers.map(&:name).reject { |n| n == @container.name }
        render action: 'show' # "edit" view is covered by "show"
        return
      end

      back_to_container_list
    end

    def destroy
      @form = ObjectStorage::Forms::ConfirmContainerAction.new(params.require(:forms_confirm_container_action))
      unless @form.validate
        render action: 'confirm_deletion'
        return
      end

      @container.destroy
      back_to_container_list
    end

    private

    def load_container
      @container = services.object_storage.find_container(params[:id])
      raise ActiveRecord::RecordNotFound, "container #{params[:id]} not found" unless @container
    end

    def back_to_container_list
      respond_to do |format|
        format.js do
          @containers = services.object_storage.containers
          render action: 'reload_container_list'
        end
        format.html { redirect_to plugin('object_storage').containers_path }
      end
    end

  end
end
