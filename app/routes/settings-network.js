import Ember from 'ember';

export default Ember.Route.extend({
  setupController: function(controller, model) {
    this._super(controller, model);
    controller.set('networkType', this.store.find('networkType', 'current'));
  }
});
