import Ember from 'ember';

export default Ember.Route.extend({
  model: function () {
    return this.store.createRecord('flavor');
  },
  renderTemplate: function (controller, model) {
    this.render({
      into: 'application',
      outlet: 'modal'
    });
  },
  deactivate: function () {
    var flavor = this.get('currentModel');
    var sla = this.store.all('sla').findBy('isDirty');
    flavor.rollback();
    if (sla) sla.rollback();
    this.controllerFor('flavorsCreate').set('selectedExistingSla', null);
  }
});
