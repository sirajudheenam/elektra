module Monitoring
  class OverviewController < Monitoring::ApplicationController
    authorization_required

    def index
      all_alarms = services.monitoring.alarms()
      
      # count alarms states and severity
      severity_cnt = Hash.new(0)
      state_cnt = Hash.new(0)
      all_alarms.map{|alarm| alarm.severity }.map{|severity| severity_cnt[severity] += 1}
      all_alarms.map{|alarm| alarm.state }.map{|state| state_cnt[state] += 1}
      
      # create pie data
      @severity_pie_data = Array.new
      @state_pie_data = Array.new
      @severity_pie_data = severity_cnt.keys.sort.map{|severity| { label: severity.capitalize, count: severity_cnt[severity] } }
      @state_pie_data = state_cnt.keys.sort.map{|state| { label: state.capitalize, count: state_cnt[state] } }
      
    end

  end
end
