App.SettingsOverridesController = Ember.ArrayController.extend({
  needs: ['overrides', 'application'],
  actions: {
    updateOverrides: function() {
      this.store.getById('override', 'current').save().then( function() {
         App.event('Successfully updated configuration overrides.', App.SUCCESS);
      }, function(xhr) {
        App.xhrError(xhr, 'An error occurred while attempting to override configuration values.');
      });
    }
  }
});
