App.SettingsController = Ember.ArrayController.extend({
  needs: 'application',
  isEnabled: Ember.computed.alias('controllers.application.isEnabled')
});
