import Ember from 'ember';

export default Ember.Controller.extend({
  isActionPending: false,
  actions: {
    reset: function() {
      this.set('isActionPending', true);
      var self = this;
      var confirmed = confirm('Are you sure you want to reset the controller? Warning: Resetting the controller may result in an unavailable UI for a duration of time, and depending on your network configuration the UI IP may change.');
      if (confirmed) {
        this.store.createRecord('action', {
          name: 'reset_controller'
        }).save().then(function() {
          self.set('isActionPending', false);
          App.event('Successfully reset the controller', App.SUCCESS);
        }, function(xhr) {
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
      var confirmed = confirm('Are you sure you want to shutdown the controller? Warning: Shutting down the controller may result in an unavailable UI.');
      if (confirmed) {
        this.store.createRecord('action', {
          name: 'shutdown_controller'
        }).save().then(function() {
          self.set('isActionPending', false);
          App.event('Successfully shutdown controller', App.SUCCESS);
        }, function(xhr) {
          self.set('isActionPending', false);
          App.xhrError(xhr, 'Failed to shutdown controller');
        });
      } else {
        self.set('isActionPending', false);
      }
    }
  }
});
