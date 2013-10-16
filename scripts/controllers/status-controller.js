App.StatusController = Ember.ObjectController.extend({
  needs: ['application'],
  // Properties
  connected: false,
  isUpdating: false,
  showStatus: function () {
    return !this.get('isUpdating') && this.get('controllers.application.loggedIn');
  }.property('isUpdating', 'controllers.application.loggedIn'),
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
  updateCurrentStatus: function () {
    var self = this;
    // Update status and check connectivity every 10 seconds
    Ember.run.later(this, 'updateCurrentStatus', 10000);
    if (!this.get('model')) {
      if (!this.get('isUpdating')) {
        this.set('isUpdating', true);
        return this.store.find('status', 'current').then(function (status) {
          self.set('model', status);
          self.set('connected', true);
          self.set('isUpdating', false);
        }, function (error) {
          self.set('connected', false);
          return new Ember.RSVP.Promise(function (resolve, reject) { reject(); });
        });
      }
    } else {
      return this.get('model').reload().then(function (status) {
        self.set('connected', true);
      }, function (error) {
        self.set('connected', false);
        return new Ember.RSVP.Promise(function (resolve, reject) { reject(); });
      });
    }
  }
});
