# frozen_string_literal: true

module Cronus
  # Cronus ApplicationController
  class ApplicationController < AjaxController
    def index
      @cronus_endpoint = email_service_url
      @current_user_token = current_user.token
      @multicloud_api_user = ENV.fetch('MULTICLOUD_API_USER', nil)
      @multicloud_api_password = ENV.fetch('MULTICLOUD_API_PASSWORD', nil)
    end
  end
end
