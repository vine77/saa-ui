import Ember from 'ember';
import Health from '../utils/mappings/health';
import uuid from '../utils/uuid';
import event from '../utils/event';
import xhrError from '../utils/xhr-error';

export default Ember.ObjectController.extend({
  needs: ['nodes'],

  bucketSloCountGreaterThanOne: function() {
    return (this.get('bucketSloCount') >= 1);
  }.property('bucketSloCount'),
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
  bucketSloCount: function() {
    var computeCount = this.get('sloTypesArray') && this.get('sloTypesArray').filter(function(x){ return x === 'assured-scu-vcpu'; }).get('length');
    var vmComputeCount = this.get('sloTypesArray') && this.get('sloTypesArray').filter(function(x){ return x === 'assured-scu-vm'; }).get('length');
    var vmCoresCount = this.get('sloTypesArray') && this.get('sloTypesArray').filter(function(x){ return x === 'assured-cores-physical'; }).get('length');
    return computeCount + vmComputeCount + vmCoresCount;
  }.property('sloTypesArray.@each', 'sloTypesArray'),
  trustSloCount: function () {
    return this.get('sloTypesArray') && this.get('sloTypesArray').filter(function(x){ return x === 'trusted_platform'; }).get('length');
  }.property('sloTypesArray.@each', 'sloTypesArray'),
  isAddSloAvailable: function() {
    return !(this.get('bucketSloCount') >= 1 && this.get('trustSloCount') >= 1);
  }.property('sloTypesArray.@each', 'sloTypesArray', 'bucketSloCount', 'trustSloCount'),

  vcpuValues: [0, 1, 2, 3, 4],
  vcpus: 0,

  isComputeSloTable: function() {
    return this.get('sloTypesArray') && this.get('sloTypesArray').contains('assured-scu-vcpu');
  }.property('sloTypesArray.@each'),
  isComputeVmSloTable: function() {
    return this.get('sloTypesArray') && this.get('sloTypesArray').contains('assured-scu-vm');
  }.property('sloTypesArray.@each'),
  isExclusiveCoresSloTable: function() {
    return this.get('sloTypesArray') && this.get('sloTypesArray').contains('assured-cores-physical');
  }.property('sloTypesArray.@each'),
  isSloTableVisible: function() {
    return (!!this.get('isComputeSloTable') || !!this.get('isComputeVmSloTable') || !!this.get('isExclusiveCoresSloTable'));
  }.property('isComputeSloTable', 'isComputeVmSloTable', 'isExclusiveCoresSloTable'),

  sloVcpuTableMaximumScus: function() {
    return this.get('controllers.nodes.maxScuCapabilities');
  }.property('controllers.nodes.maxScuCapabilities', 'vcpus', 'isComputeVmSloTable'),
  sloVcpuTableNumberOfNodesMaximumScus: function() {
    var self = this;
    return this.get('controllers.nodes.model').filterBy('isAssured').filterBy('capabilities.max_scu_per_core').reduce( function(previousValue, item, index, enumerable) {
      return previousValue + (item.get('capabilities.max_scu_per_core') >= self.get('controllers.nodes.maxScuCapabilities'));
    }, 0);
  }.property('controllers.nodes.model.@each', 'controllers.nodes'),
  sloVcpuTableMedianScus: function() {
    return this.get('controllers.nodes.medianScuCapabilities');
  }.property('controllers.nodes.medianScuCapabilities', 'vcpus'),
  sloVcpuTableNumberOfNodesMedianScus: function() {
    var self = this;
    return this.get('controllers.nodes.model').filterBy('isAssured').filterBy('capabilities.max_scu_per_core').reduce( function(previousValue, item, index, enumerable) {
      return previousValue + (item.get('capabilities.max_scu_per_core') >= self.get('controllers.nodes.maxScuCapabilities'));
    }, 0);
  }.property('controllers.nodes.model.@each'),
  sloVcpuTableMinimumScus: function() {
    return this.get('controllers.nodes.minScuCapabilities');
  }.property('controllers.nodes.minScuCapabilities', 'vcpus'),
  sloVcpuTableNumberOfNodesMinimumScus: function() {
    var self = this;
    return this.get('controllers.nodes.model').filterBy('isAssured').filterBy('capabilities.max_scu_per_core').reduce( function(previousValue, item, index, enumerable) {
      return previousValue + (item.get('capabilities.max_scu_per_core') >= self.get('controllers.nodes.minScuCapabilities'));
    }, 0);
  }.property('controllers.nodes.model.@each'),

  sloVmTableMaximumScus: function() {
    return this.get('controllers.nodes.maxScuCapabilities') * this.get('vcpus');
  }.property('controllers.nodes.maxScuCapabilities', 'vcpus', 'isComputeVmSloTable'),
  sloVmTableNumberOfNodesMaximumScus: function() {
    var self = this;
    return this.get('controllers.nodes.model').filterBy('isAssured').filterBy('capabilities.max_scu_per_core').reduce( function(previousValue, item, index, enumerable) {
      return previousValue + (item.get('capabilities.max_scu_per_core') >= self.get('controllers.nodes.maxScuCapabilities'));
    }, 0);
  }.property('controllers.nodes.model.@each', 'controllers.nodes'),
  sloVmTableMedianScus: function() {
    return this.get('controllers.nodes.medianScuCapabilities') * this.get('vcpus');
  }.property('controllers.nodes.medianScuCapabilities', 'vcpus'),
  sloVmTableNumberOfNodesMedianScus: function() {
    var self = this;
    return this.get('controllers.nodes.model').filterBy('isAssured').filterBy('capabilities.max_scu_per_core').reduce( function(previousValue, item, index, enumerable) {
      return previousValue + (item.get('capabilities.max_scu_per_core') >= self.get('controllers.nodes.maxScuCapabilities'));
    }, 0);
  }.property('controllers.nodes.model.@each'),
  sloVmTableMinimumScus: function() {
    return this.get('controllers.nodes.minScuCapabilities') * this.get('vcpus');
  }.property('controllers.nodes.minScuCapabilities', 'vcpus'),
  sloVmTableNumberOfNodesMinimumScus: function() {
    var self = this;
    return this.get('controllers.nodes.model').filterBy('isAssured').filterBy('capabilities.max_scu_per_core').reduce( function(previousValue, item, index, enumerable) {
      return previousValue + (item.get('capabilities.max_scu_per_core') >= self.get('controllers.nodes.minScuCapabilities'));
    }, 0);
  }.property('controllers.nodes.model.@each'),

  sloExclusiveCoresTableMaximum: function() {
    return this.get('controllers.nodes.maxScuCapabilities');
  }.property('controllers.nodes.maxScuCapabilities', 'vcpus', 'isComputeVmSloTable'),
  sloExclusiveCoresTableNumberOfNodesMaximum: function() {
    var self = this;
    return this.get('controllers.nodes.model').filterBy('isAssured').filterBy('capabilities.max_scu_per_core').reduce( function(previousValue, item, index, enumerable) {
      return previousValue + (item.get('capabilities.cores_per_socket') >= self.get('controllers.nodes.maxScuCapabilities'));
    }, 0);
  }.property('controllers.nodes.model.@each', 'controllers.nodes'),
  sloExclusiveCoresTableMedian: function() {
    return this.get('controllers.nodes.medianScuCapabilities');
  }.property('controllers.nodes.medianScuCapabilities', 'vcpus'),
  sloExclusiveCoresTableNumberOfNodesMedian: function() {
    var self = this;
    return this.get('controllers.nodes.model').filterBy('isAssured').filterBy('capabilities.max_scu_per_core').reduce( function(previousValue, item, index, enumerable) {
      return previousValue + (item.get('capabilities.cores_per_socket') >= self.get('controllers.nodes.maxScuCapabilities'));
    }, 0);
  }.property('controllers.nodes.model.@each'),
  sloExclusiveCoresTableMinimum: function() {
    return this.get('controllers.nodes.minScuCapabilities');
  }.property('controllers.nodes.minScuCapabilities', 'vcpus'),
  sloExclusiveCoresTableNumberOfNodesMinimum: function() {
    var self = this;
    return this.get('controllers.nodes.model').filterBy('isAssured').filterBy('capabilities.max_scu_per_core').reduce( function(previousValue, item, index, enumerable) {
      return previousValue + (item.get('capabilities.cores_per_socket') >= self.get('controllers.nodes.minScuCapabilities'));
    }, 0);
  }.property('controllers.nodes.model.@each'),

  isSlaEditing: false,
  actions: {
    addSlo: function() {
      this.get('model.slos').addObject(this.store.createRecord('slo', {id: uuid()}));
    },
    deleteSlo: function(slo) {
      slo.clearInverseRelationships();
    },
    editSla: function() {
      var self = this;
      if (this.get('isSlaEditing')) return;
      this.set('isSlaEditing', true);
      var sla = this.get('model');
      /*
      var slos = this.get('slos');
      sloPromises = [];
      slos.forEach(function(slo) {
        sloPromises.push(slo.save());
      });
      Ember.RSVP.all(sloPromises).then(function() {
        return sla.save();
      }).then(function() {
      */
      sla.save().then(function() {
        event('Successfully modified SLA "' + sla.get('name') + '".', Health.SUCCESS);
        Ember.$('.modal:visible').modal('hide');
        self.set('isSlaEditing', false);
      }, function(xhr) {
        xhrError(xhr, 'An error occurred while attempting to modify SLA "' + sla.get('name') + '".');
        self.set('isSlaEditing', false);
      });
      // TODO: Manually set SLO records to saved to clear isDirty
    }
  }
});
