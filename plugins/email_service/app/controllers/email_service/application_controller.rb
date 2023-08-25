# frozen_string_literal: true

module EmailService
  # EmailService ApplicationController
  class ApplicationController < ::DashboardController
    include ::EmailService::ApplicationHelper

    authorization_context 'email_service'
    authorization_required

    def check_pre_conditions_for_cronus
      # Step 1: Role Check
      unless ( current_user.has_role?('email_user') || current_user.has_role?('email_admin') || current_user.has_role?('cloud_email_admin' )
        render 'email_service/shared/role_warning.html' and return
      end
      # Step 2: EC2 Credentials
      if ec2_creds.nil? || !ec2_creds
        render 'email_service/shared/ec2_credentials_warning.html' and return
      end
      # Step 3: Check Verified Identity & Domain for int provider only
      # if (email_addresses&.empty? && domains&.empty?)
      #   render 'email_service/shared/verified_identity_warning.html' and return
      # end
      # Step 4: Enable Cronus
      unless nebula_active?
        render 'email_service/shared/cronus_activation_warning.html', locals: {@nebula_status => nebula_status} and return
      end
    end

    protected

    helper_method :release_state

    def release_state
      'tech_preview'
    end
  end
end
