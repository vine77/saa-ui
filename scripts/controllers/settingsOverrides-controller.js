App.SettingsOverridesController = Ember.ObjectController.extend({
  configurationValuesExist: Ember.computed.gt('model.configurationValues.length', 0),
  isActionPending: false,
  actions: {
    updateOverrides: function() {
      var self = this;
      this.set('isActionPending', true);
      return this.store.getById('override', 'current').save().then(function() {
        self.set('isActionPending', false);
        App.event('Successfully updated configuration override values.', App.SUCCESS);
      }, function(xhr) {
        self.set('isActionPending', false);
        App.xhrError(xhr, 'An error occurred while attempting to save configuration override values.');
      });
    },
    cancel: function() {
      this.get('model').reload();
    }
  }
});
