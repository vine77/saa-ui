App.SettingsOverridesController = Ember.ObjectController.extend({
  configurationValuesExist: Ember.computed.gt('model.configurationValues.length', 0),
  actions: {
    updateOverrides: function() {
      return this.store.getById('override', 'current').save().then(function() {
        App.event('Successfully updated configuration overrides.', App.SUCCESS);
      }, function(xhr) {
        App.xhrError(xhr, 'An error occurred while attempting to override configuration values.');
      });
    },
    cancel: function() {
      this.get('model').reload();
    }
  }
});
