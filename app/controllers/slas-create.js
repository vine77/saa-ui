import Ember from 'ember';
import Health from '../utils/mappings/health';
import uuid from '../utils/uuid';
import event from '../utils/event';
import xhrError from '../utils/xhr-error';

export default Ember.ObjectController.extend({
  needs: ['nodes'],
  isSlaCreating: false,
  sloTemplates: function() {
    return this.store.all('sloTemplate');
  }.property(),
  actions: {
    addSlo: function() {
      this.get('model.slos').addObject(this.store.createRecord('slo', {id: uuid()}));
    },
    deleteSlo: function(slo) {
      slo.clearInverseRelationships();
    },
    createSla: function() {
      var self = this;
      if (this.get('isSlaCreating')) return;
      this.set('isSlaCreating', true);
      var sla = this.get('model');
      sla.save().then(function() {
        event('Successfully created SLA "' + sla.get('name') + '".', Health.SUCCESS);
        Ember.$('.modal:visible').modal('hide');
        self.set('isSlaCreating', false);
      }, function(xhr) {
        xhrError(xhr, 'An error occurred while attempting to create SLA "' + sla.get('name') + '".');
        self.set('isSlaCreating', false);
      });
    }
  }
});


