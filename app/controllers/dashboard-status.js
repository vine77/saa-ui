import Ember from 'ember';

export default Ember.ArrayController.extend({
  needs: ['application', 'statuses', 'build', 'nodes', 'vms'],
  haMessages: function() {
    var messages = [];
    var cloudSchedulingService = this.get('controllers.statuses.model').findBy('id', 'cloud_scheduling_service');
    var cloudSchedulingServiceMessage = cloudSchedulingService && this.get('controllers.statuses.model').findBy('id', 'cloud_scheduling_service').get('message');
    var schedulerPluginVersion = this.get('controllers.statuses.model').findBy('id', 'scheduler_plugin_version');
    var schedulerPluginVersionMessage = schedulerPluginVersion && this.get('controllers.statuses.model').findBy('id', 'scheduler_plugin_version').get('message');
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
