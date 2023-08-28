# frozen_string_literal: true

module Cronus
  # Cronus ApplicationController
  class ApplicationController < AjaxController
    def index
      @cronusEndpoint = email_service_url
      @currentUserToken = current_user.token
      @multicloudApiUser = ENV.fetch('MULTICLOUD_API_USER', nil)
      @multicloudApiPassword = ENV.fetch('MULTICLOUD_API_PASSWORD', nil)
    end
  end
end
