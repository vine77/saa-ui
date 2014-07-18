import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel: function() {
    this.transitionTo('status1', this.store.getById('status', 'system'));
  }
});
