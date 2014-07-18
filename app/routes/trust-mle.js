import Ember from 'ember';

export default Ember.Route.extend({
  setupController: function(controller, model) {
    this._super(controller, model);
    model.reload();
    this.controllerFor('trustMles').setEach('isExpanded', false);
    this.controllerFor('trustMles').findBy('id', model.get('id')).set('isExpanded', true);
  }
});
