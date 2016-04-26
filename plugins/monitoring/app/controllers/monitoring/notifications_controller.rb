module Monitoring
  class NotificationsController < Monitoring::ApplicationController
    authorization_context 'monitoring'

    def index
      notifications = services.monitoring.notification_methods
      sorted_notifications = []
      # sort by name
      notifications.sort_by(&:name).each do |notification|
        sorted_notifications << notification
      end

      @notifications = Kaminari.paginate_array(sorted_notifications).page(params[:page]).per(10)
    end

    def new
      @notification = services.monitoring.new_notification_method(name: "")
    end

    def edit
      @notification = services.monitoring.get_notification_method(params.require(:id))
    end

    def create
      @notification = services.monitoring.new_notification_method(params.require(:notification_method))
      unless @notification.save
        render action: 'new'
        return
      end
      back_to_notification_list
    end

    def update
      @notification = services.monitoring.get_notification_method(params.require(:id))
      attrs = params.require(:notification_method).permit(:name, :type, :address)
      unless @notification.update_attributes(attrs)
        render action: 'edit'
        return
      end
      back_to_notification_list
    end

    def destroy 
       notification = services.monitoring.get_notification_method(params.require(:id))
       raise ActiveRecord::RecordNotFound, "Notification with id #{params[:id]} not found" unless notification
       notification.destroy
       back_to_notification_list
    end

    private

    def back_to_notification_list
      respond_to do |format|
        format.js do
          notifications = services.monitoring.notification_methods
          @notifications = Kaminari.paginate_array(notifications).page(params[:page]).per(10)
          render action: 'reload_list'
        end
        format.html { redirect_to plugin('monitoring').notifications_path }
      end
    end
    
  end
end
