import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return this.modelFor('sla');
  },
  renderTemplate: function(controller, model) {
    this.render({
      into: 'application',
      outlet: 'modal'
    });
  },
  setupController: function(controller, model) {
    this._super(controller, model);
    model.set('isEditing', true);
  },
  deactivate: function() {
    var sla = this.get('currentModel');
    sla.set('isEditing', false);
    sla.rollback();  // Rollback record properties
    // Reload record relationships, then rollback relationships
    sla.reload().then(function(model) {
      model.relatedRecords().forEach(function(item) {
        item.rollback();
      });
    });
  }
});
