import Ember from 'ember';
import Health from '../utils/mappings/health';
import uuid from '../utils/uuid';
import event from '../utils/event';
import xhrError from '../utils/xhr-error';

export default Ember.ObjectController.extend({
  needs: ['nodes'],
  isSlaCreating: false,
  sloTemplates: function() {
    var self = this;
    var returnArray = this.store.all('sloTemplate').map(function(item, index, enumerable) {
      var disabled = false;
      switch(item.get('sloType')) {
        case 'assured-scu-vcpu':
          if (self.get('bucketSloCount') >= 1) {
            disabled = true;
          }
          item.set('readableSloType', 'Assured SCUs (per-vCPU)');
          item.set('group', 'Compute Modes');
          break;
        case 'assured-scu-vm':
          if (self.get('bucketSloCount') >= 1) {
            disabled = true;
          }
          item.set('readableSloType', 'Assured SCUs (per-VM)');
          item.set('group', 'Compute Modes');
          break;
        case 'assured-cores-physical':
          if (self.get('bucketSloCount') >= 1) {
            disabled = true;
          }
          item.set('readableSloType', 'Assured physical cores');
          item.set('group', 'Compute Modes');
          break;
        case 'trusted_platform':
          if (self.get('trustSloCount') >= 1) {
            disabled = true;
            item.set('group', 'Trust');
          }
          item.set('readableSloType', 'Trusted platform');
          break;
        default:
          disabled = false;
          break;
      }
      item.disabled = disabled;
      return item;
    });
    return returnArray.sortBy('readableSloType');
  }.property('isAddSloAvailable', 'bucketSloCount', 'model.sla.sloTypesArray.@each'),
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


