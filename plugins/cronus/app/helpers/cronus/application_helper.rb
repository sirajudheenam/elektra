module Cronus
  # Cronus ApplicationHelper
  module ApplicationHelper
    def email_service_url
      @email_service_url ||= current_user.service_url("email-aws")
    end
  end
end
