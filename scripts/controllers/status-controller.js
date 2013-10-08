App.StatusController = Ember.ObjectController.extend({
  // Properties
  connected: false,
  statusErrorMessages: function () {
    var statusMessages = this.get('model.messages');
    return (!statusMessages) ? undefined : statusMessages.filter(function (item, index, enumerable) {
      return item.health > App.SUCCESS;
    });
  }.property('model.messages.@each'),
  statusClass: function () {
    return (!this.get('model.health')) ? 'alert-info' : 'alert-' + App.priorityToType(this.get('model.health'));
  }.property('model.health'),

  // Functions
  init: function () {
    this._super();
    this.updateCurrentStatus();
    statusController = this;
  },
  updateCurrentStatus: function () {
    var controller = this;
    if (!this.get('model')) {
      this.store.find('status', 'current').then(function (status) {
        controller.set('model', status);
        controller.set('connected', true);
      }, function (error) {
        controller.set('connected', false);
      });
    } else {
      this.get('model').reload().then(function (status) {
        controller.set('connected', true);
      }, function (error) {
        controller.set('connected', false);
      });
    }
    // Update status and check connectivity every 10 seconds
    Ember.run.later(this, 'updateCurrentStatus', 10000);
  }
});
