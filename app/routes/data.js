import Ember from 'ember';

// Routes under /app/data require app to be enabled
export default Ember.Route.extend({
  beforeModel: function() {
    if (!this.controllerFor('application').get('isEnabled')) {
      this.transitionTo('index');
    }
  }
});
