import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel: function () {
    var availableSettings = [];
    if (!this.controllerFor('build').get('isReadycloud')) {
      availableSettings.push('settings.upload');
      availableSettings.push('settings.network');
    }
    if (!this.controllerFor('application').get('isFramed')) {
      availableSettings.push('settings.users');
      availableSettings.push('settings.mailserver');
    }
    if (this.controllerFor('application').get('isConfigured')) {
      availableSettings.push('settings.log');
      availableSettings.push('settings.trust');
    }
    if (!this.controllerFor('application').get('isFramed')) {
      availableSettings.push('settings.controller');
    }
    if (!Ember.isEmpty(availableSettings)) this.transitionTo(availableSettings[0]);
  }
});
