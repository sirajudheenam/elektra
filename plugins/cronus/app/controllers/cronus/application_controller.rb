# frozen_string_literal: true

module Cronus
  # Cronus ApplicationController
  class ApplicationController < AjaxController
    def index
      @cronus_endpoint = email_service_url
      @current_user_token = current_user.token
    end
  end
end
