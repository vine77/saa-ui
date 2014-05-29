App.DashboardStatusController = Ember.ArrayController.extend({
  needs: ['application', 'statuses', 'build', 'nodes', 'vms'],
  haMessages: function() {
    var messages = [];
    statuses = this.get('controllers.statuses.model');
    cloudScheduling = statuses.filterBy('id', 'cloud_scheduling_service');
    cloudSchedulingMessage = cloudScheduling.get('message');
    schedulerPluginVersion = statuses.filterBy('id', 'scheduler_plugin_version');
    schedulerPluginVersionMessage = schedulerPluginVersion.get('message');

    if (statuses) {
      if (!Ember.isEmpty(cloudScheduling)) {
        if (!Ember.isEmpty(cloudSchedulingMessage)) {
          messages.addObject({ styleClass: 'text-success', message: cloudSchedulingMessage}); 
        } else {
          messages.addObject({ styleClass: 'text-warning', message: 'Cloud scheduling status message is empty.'});
        }
      } else {
        messages.addObject({ styleClass: 'text-warning', message: 'Cloud scheduling status is not available.'});
      }
      if (!Ember.isEmpty(schedulerPluginVersion)) {
        if (!Ember.isEmpty(schedulerPluginVersionMessage)) {
          messages.addObject({ styleClass: 'text-success', message: schedulerPluginVersionMessage}); 
        } else {
          messages.addObject({ styleClass: 'text-warning', message: 'Scheduler plugin version status message is empty.'});
        }
      } else {
        messages.addObject({ styleClass: 'text-warning', message: 'Scheduler plugin version status is not available.'});
      }
    } else {
      messages.addObject({ styleClass: 'text-warning', message: 'System statuses are not currently available. Please check configuration.'});
    }
    return messages;
  }.property('controllers.statuses.@each')
});
