import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel: function () {
    var loggedIn = this.controllerFor('application').get('loggedIn');
    if (loggedIn) this.transitionTo('index');
  },
  setupController: function(controller, model) {
    controller.set('username', '');
    controller.set('password', '');
  }
});
