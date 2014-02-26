App.SettingsControllerController = Ember.Controller.extend({
  isActionPending: false,
  actions: {
    reset: function () {
      this.set('isActionPending', true);
      var self = this;
      var confirmed = confirm('Are you sure you want to reset the controller?');
      if (confirmed) {
        this.store.createRecord('action', {
          name: 'reset_controller'
        }).save().then(function () {
          self.set('isActionPending', false);
          App.event('Successfully reset the controller', App.SUCCESS);
        }, function (xhr) {
          self.set('isActionPending', false);
          App.xhrError(xhr, 'Failed to reset the controller');
        });
      } else {
        self.set('isActionPending', false);
      }
    },
    shutdown: function() {
      this.set('isActionPending', true);
      var self = this;
      var confirmed = confirm('Are you sure you want to shutdown the controller?');
      if (confirmed) {
        this.store.createRecord('action', {
          name: 'reset_controller'
        }).save().then(function () {
          self.set('isActionPending', false);
          App.event('Successfully reset controller', App.SUCCESS);
        }, function (xhr) {
          self.set('isActionPending', false);
          App.xhrError(xhr, 'Failed to reset controller');
        });
      } else {
        self.set('isActionPending', false);
      }
    }
  }
});
