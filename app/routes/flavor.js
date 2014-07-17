import Ember from 'ember';

export default Ember.Route.extend({
  setupController: function (controller, model) {
    this._super(controller, model);
    this.controllerFor('flavors').setEach('isExpanded', false);
    this.controllerFor('flavors').findBy('id', model.get('id')).set('isExpanded', true);
  }
});
