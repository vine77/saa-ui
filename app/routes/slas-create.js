import Ember from 'ember';
import uuid from '../utils/uuid';

export default Ember.Route.extend({
  model: function() {
    return this.store.createRecord('sla', {id: uuid()});
  },
  renderTemplate: function(controller, model) {
    this.render({
      into: 'application',
      outlet: 'modal'
    });
  },
  deactivate: function() {
    var sla = this.get('currentModel');
    sla.rollback();
  }
});
