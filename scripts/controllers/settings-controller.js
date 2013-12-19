App.SettingsController = Ember.ArrayController.extend({
  needs: ['application', 'build'],
  isEnabled: Ember.computed.alias('controllers.application.isEnabled'),
  isConfigured: Ember.computed.alias('controllers.application.isConfigured')
});
