import Ember from 'ember';

export default Ember.Route.extend({
  model: function () {
    return this.store.createRecord('sla', {id: App.uuid()});
  },
  renderTemplate: function (controller, model) {
    this.render({
      into: 'application',
      outlet: 'modal'
    });
  },
  deactivate: function () {
    var sla = this.get('currentModel');
    sla.rollback();
  }
});
