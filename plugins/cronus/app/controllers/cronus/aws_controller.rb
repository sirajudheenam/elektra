# frozen_string_literal: true

module Cronus
    class AwsController < AjaxController
        def account_details
            @account_details = aws_account_details
            render json: @account_details
        end
      def index
        render json: [
          { id: SecureRandom.uuid, name: 'Entry1', description: 'Test Entry 1'},
          { id: SecureRandom.uuid, name: 'Entry2', description: 'Test Entry 2'},
          { id: SecureRandom.uuid, name: 'Entry3', description: 'Test Entry 3'}
        ]
      end
  
      def create
        render json: {
          id: SecureRandom.uuid,
          name: params[:entry][:name],
          description: params[:entry][:description]
        }
      end
  
      def update
        render json: {
          id: params[:id],
          name: params[:entry][:name],
          description: params[:entry][:description]
        }
      end
  
      def destroy
        head :no_content
      end
    end
  end
  