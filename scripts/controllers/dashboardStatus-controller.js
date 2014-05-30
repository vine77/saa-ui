App.DashboardStatusController = Ember.ArrayController.extend({
  needs: ['application', 'statuses', 'build', 'nodes', 'vms'],
  haMessages: function() {
    var messages = [];
    cloudSchedulingService = this.get('controllers.statuses.model').findBy('id', 'cloud_scheduling_service');
    cloudSchedulingServiceMessage = cloudSchedulingService && this.get('controllers.statuses.model').findBy('id', 'cloud_scheduling_service').get('message');
    schedulerPluginVersion = this.get('controllers.statuses.model').findBy('id', 'scheduler_plugin_version');
    schedulerPluginVersionMessage = cloudSchedulingService && this.get('controllers.statuses.model').findBy('id', 'scheduler_plugin_version').get('message');
    if (!schedulerPluginVersionMessage && !schedulerPluginVersionMessage) return [{
      title: 'High Availability',
      message: 'N/A'
    }];
    if (cloudSchedulingServiceMessage) messages.push({
      title: 'Cloud Scheduling Services',
      message: cloudSchedulingServiceMessage
    });
    if (schedulerPluginVersionMessage) messages.push({
      title: 'Scheduler Plugins',
      message: schedulerPluginVersionMessage
    });
    return messages;
  }.property('controllers.statuses.@each')
});
