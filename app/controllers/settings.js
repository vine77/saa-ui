import Ember from 'ember';

export default Ember.ArrayController.extend({
  needs: ['application', 'build'],
  isReadycloud: Ember.computed.alias('controllers.build.isReadycloud'),
  isEnabled: Ember.computed.alias('controllers.application.isEnabled'),
  isConfigured: Ember.computed.alias('controllers.application.isConfigured'),
  isFramed: Ember.computed.alias('controllers.application.isFramed')
});
