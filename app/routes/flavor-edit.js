import Ember from 'ember';

export default Ember.Route.extend({
  model: function () {
    return this.modelFor('flavor');
  },
  renderTemplate: function (controller, model) {
    this.render({
      into: 'application',
      outlet: 'modal'
    });
  },
  setupController: function (controller, model) {
    this._super(controller, model);
    model.set('isEditing', true);
  },
  deactivate: function () {
    var flavor = this.get('currentModel');
    var sla = this.store.all('sla').findBy('isDirty');
    flavor.set('isEditing', false);
    flavor.rollback();  // Rollback record properties
    flavor.reload();  // Reload record relationships
    if (sla) sla.rollback();
    this.controllerFor('flavorsCreate').set('selectedExistingSla', null);
  }
});
