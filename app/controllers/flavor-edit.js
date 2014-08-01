import Ember from 'ember';
import Health from '../utils/mappings/health';
import uuid from '../utils/uuid';
import event from '../utils/event';
import xhrError from '../utils/xhr-error';

export default Ember.ObjectController.extend({
  needs: ['flavors', 'slas', 'nodes'],

  sloTemplates: function() {
    var self = this;
    var returnArray = this.store.all('sloTemplate').map(function(item, index, enumerable) {
      var disabled = false;
      switch(item.get('sloType')) {
        case 'compute':
          if (self.get('bucketSloCount') >= 1) {
            disabled = true;
          }
          break;
        case 'vm_compute':
          if (self.get('bucketSloCount') >= 1) {
            disabled = true;
          }
          break;
        case 'vm_cores':
          if (self.get('bucketSloCount') >= 1) {
            disabled = true;
          }
          break;
        case 'trusted_platform':
          if (self.get('trustSloCount') >= 1) {
            disabled = true;
          }
          break;
        default:
          disabled = false;
          break;
      }
      item.disabled = disabled;
      return item;
    });
    return returnArray;
  }.property('isAddSloAvailable', 'model.sla.sloTypesArray.@each'),
  bucketSloCount: function() {
    var computeCount = this.get('model.sla.sloTypesArray') && this.get('model.sla.sloTypesArray').filter(function(x){ return x == 'compute'; }).get('length');
    var vmComputeCount = this.get('model.sla.sloTypesArray') && this.get('model.sla.sloTypesArray').filter(function(x){ return x == 'vm_compute'; }).get('length');
    var vmCoresCount = this.get('model.sla.sloTypesArray') && this.get('model.sla.sloTypesArray').filter(function(x){ return x == 'vm_cores'; }).get('length');
    return computeCount + vmComputeCount + vmCoresCount;
  }.property('model.sla.sloTypesArray.@each', 'model.sla.sloTypesArray'),
  trustSloCount: function () {
    return this.get('model.sla.sloTypesArray') && this.get('model.sla.sloTypesArray').filter(function(x){ return x == 'trusted_platform'; }).get('length');
  }.property('model.sla.sloTypesArray.@each', 'model.sla.sloTypesArray'),
  isAddSloAvailable: function() {
    return !(this.get('bucketSloCount') >= 1 && this.get('trustSloCount') >= 1);
  }.property('model.sla.sloTypesArray.@each', 'model.sla.sloTypesArray', 'bucketSloCount', 'trustSloCount'),

  vcpusInteger: function() {
    return ((this.get('model.vcpus'))?this.get('model.vcpus'):0);
  }.property('model.vcpus'),
  isComputeSloTable: function() {
    return this.get('model.sla.sloTypesArray') && this.get('model.sla.sloTypesArray').contains('compute');
  }.property('model.sla.sloTypesArray.@each'),
  isComputeVmSloTable: function() {
    return this.get('model.sla.sloTypesArray') && this.get('model.sla.sloTypesArray').contains('vm_compute');
  }.property('model.sla.sloTypesArray.@each'),
  isExclusiveCoresSloTable: function() {
    return this.get('model.sla.sloTypesArray') && this.get('model.sla.sloTypesArray').contains('vm_cores');
  }.property('model.sla.sloTypesArray.@each'),
  isSloTableVisible: function() {
    return (!!this.get('isComputeSloTable') || !!this.get('isComputeVmSloTable') || !!this.get('isExclusiveCoresSloTable'));
  }.property('isComputeSloTable', 'isComputeVmSloTable', 'isExclusiveCoresSloTable'),

  sloVcpuTableMaximumScus: function() {
    return this.get('controllers.nodes.maxScuCapabilities');
  }.property('controllers.nodes.maxScuCapabilities', 'model.vcpus', 'isComputeVmSloTable'),
  sloVcpuTableNumberOfNodesMaximumScus: function() {
    var self = this;
    return this.get('controllers.nodes.model').filterBy('isAssured').filterBy('capabilities.max_scu_per_core').reduce( function(previousValue, item, index, enumerable) {
      return previousValue + (item.get('capabilities.max_scu_per_core') >= self.get('controllers.nodes.maxScuCapabilities'));
    }, 0);
  }.property('controllers.nodes.model.@each', 'controllers.nodes'),
  sloVcpuTableMedianScus: function() {
    return this.get('controllers.nodes.medianScuCapabilities');
  }.property('controllers.nodes.medianScuCapabilities', 'model.vcpus'),
  sloVcpuTableNumberOfNodesMedianScus: function() {
    var self = this;
    return this.get('controllers.nodes.model').filterBy('isAssured').filterBy('capabilities.max_scu_per_core').reduce( function(previousValue, item, index, enumerable) {
      return previousValue + (item.get('capabilities.max_scu_per_core') >= self.get('controllers.nodes.maxScuCapabilities'));
    }, 0);
  }.property('controllers.nodes.model.@each'),
  sloVcpuTableMinimumScus: function() {
    return this.get('controllers.nodes.minScuCapabilities');
  }.property('controllers.nodes.minScuCapabilities', 'model.vcpus'),
  sloVcpuTableNumberOfNodesMinimumScus: function() {
    var self = this;
    return this.get('controllers.nodes.model').filterBy('isAssured').filterBy('capabilities.max_scu_per_core').reduce( function(previousValue, item, index, enumerable) {
      return previousValue + (item.get('capabilities.max_scu_per_core') >= self.get('controllers.nodes.minScuCapabilities'));
    }, 0);
  }.property('controllers.nodes.model.@each'),

  sloVmTableMaximumScus: function() {
    return this.get('controllers.nodes.maxScuCapabilities') * this.get('vcpusInteger');
  }.property('controllers.nodes.maxScuCapabilities', 'vcpusInteger', 'isComputeVmSloTable'),
  sloVmTableNumberOfNodesMaximumScus: function() {
    var self = this;
    return this.get('controllers.nodes.model').filterBy('isAssured').filterBy('capabilities.max_scu_per_core').reduce( function(previousValue, item, index, enumerable) {
      return previousValue + (item.get('capabilities.max_scu_per_core') >= self.get('controllers.nodes.maxScuCapabilities'));
    }, 0);
  }.property('controllers.nodes.model.@each', 'controllers.nodes'),
  sloVmTableMedianScus: function() {
    return this.get('controllers.nodes.medianScuCapabilities') * this.get('vcpusInteger');
  }.property('controllers.nodes.medianScuCapabilities', 'vcpusInteger'),
  sloVmTableNumberOfNodesMedianScus: function() {
    var self = this;
    return this.get('controllers.nodes.model').filterBy('isAssured').filterBy('capabilities.max_scu_per_core').reduce( function(previousValue, item, index, enumerable) {
      return previousValue + (item.get('capabilities.max_scu_per_core') >= self.get('controllers.nodes.maxScuCapabilities'));
    }, 0);
  }.property('controllers.nodes.model.@each'),
  sloVmTableMinimumScus: function() {
    return this.get('controllers.nodes.minScuCapabilities') * this.get('vcpusInteger');
  }.property('controllers.nodes.minScuCapabilities', 'vcpusInteger'),
  sloVmTableNumberOfNodesMinimumScus: function() {
    var self = this;
    return this.get('controllers.nodes.model').filterBy('isAssured').filterBy('capabilities.max_scu_per_core').reduce( function(previousValue, item, index, enumerable) {
      return previousValue + (item.get('capabilities.max_scu_per_core') >= self.get('controllers.nodes.minScuCapabilities'));
    }, 0);
  }.property('controllers.nodes.model.@each'),

  sloExclusiveCoresTableMaximum: function() {
    return this.get('controllers.nodes.maxScuCapabilities');
  }.property('controllers.nodes.maxScuCapabilities', 'model.vcpus', 'isComputeVmSloTable'),
  sloExclusiveCoresTableNumberOfNodesMaximum: function() {
    var self = this;
    return this.get('controllers.nodes.model').filterBy('isAssured').filterBy('capabilities.max_scu_per_core').reduce( function(previousValue, item, index, enumerable) {
      return previousValue + (item.get('capabilities.cores_per_socket') >= self.get('controllers.nodes.maxScuCapabilities'));
    }, 0);
  }.property('controllers.nodes.model.@each', 'controllers.nodes'),
  sloExclusiveCoresTableMedian: function() {
    return this.get('controllers.nodes.medianScuCapabilities');
  }.property('controllers.nodes.medianScuCapabilities', 'model.vcpus'),
  sloExclusiveCoresTableNumberOfNodesMedian: function() {
    var self = this;
    return this.get('controllers.nodes.model').filterBy('isAssured').filterBy('capabilities.max_scu_per_core').reduce( function(previousValue, item, index, enumerable) {
      return previousValue + (item.get('capabilities.cores_per_socket') >= self.get('controllers.nodes.maxScuCapabilities'));
    }, 0);
  }.property('controllers.nodes.model.@each'),
  sloExclusiveCoresTableMinimum: function() {
    return this.get('controllers.nodes.minScuCapabilities');
  }.property('controllers.nodes.minScuCapabilities', 'model.vcpus'),
  sloExclusiveCoresTableNumberOfNodesMinimum: function() {
    var self = this;
    return this.get('controllers.nodes.model').filterBy('isAssured').filterBy('capabilities.max_scu_per_core').reduce( function(previousValue, item, index, enumerable) {
      return previousValue + (item.get('capabilities.cores_per_socket') >= self.get('controllers.nodes.minScuCapabilities'));
    }, 0);
  }.property('controllers.nodes.model.@each'),

  isFlavorEditing: false,
  flavorsWithoutSlas: function() {
    return this.get('controllers.flavors').filterBy('sla', null);
  }.property('controllers.flavors.@each.sla'),
  slas: function() {
    return this.get('controllers.slas').filterBy('deleted', false).filterBy('isDirty', false);
  }.property('controllers.slas.@each', 'controllers.slas.@each.deleted'),
  hasNoSla: function() {
    return this.get('model.sla') === null;
  }.property('model.sla'),
  hasExistingSla: function() {
    return this.get('model.sla.isDirty') === false;
  }.property('model.sla'),
  hasNewSla: function() {
    return this.get('model.sla.isDirty') === true;
  }.property('model.sla'),
  selectedExistingSla: null,
  storeExistingSla: function() {
    if (this.get('model.sla') && !this.get('model.sla.isDirty')) {
      this.set('selectedExistingSla', this.get('model.sla'));
    }
  },
  actions: {
    selectSlaType: function(slaType) {
      this.storeExistingSla();
      if (slaType === undefined) {  // No SLA button
        this.set('model.sla', null);
      } else if (slaType === 'existing') {  // Existing SLA button
        var selectedExistingSla = this.get('selectedExistingSla');
        if (!this.get('selectedExistingSla')) selectedExistingSla = this.get('slas.firstObject');
        this.set('model.sla', selectedExistingSla);
      } else if (slaType === 'new') {  // New SLA button
        var newSla = this.store.all('sla').findBy('isDirty');
        if (!newSla) newSla = this.store.createRecord('sla', {deleted: false});
        this.set('model.sla', newSla);
      }
    },
    addSlo: function() {
      this.get('model.sla.slos').addObject(this.store.createRecord('slo', {id: uuid()}));
    },
    deleteSlo: function(slo) {
      slo.clearInverseRelationships();
    },
    editFlavor: function() {
      var self = this;
      if (this.get('isFlavorEditing')) return;
      this.set('isFlavorEditing', true);
      var flavor = this.get('model');
      var sla = flavor.get('sla');
      if (sla && sla.get('isDirty')) {
        sla.save().then(function() {
          return flavor.save();
        }).then(function() {
          event('Successfully modified flavor "' + flavor.get('name') + '".', Health.SUCCESS);
          Ember.$('.modal:visible').modal('hide');
          self.set('isFlavorEditing', false);
        }, function(xhr) {
          xhrError(xhr, 'An error occurred while attempting to modify flavor "' + flavor.get('name') + '".');
          self.set('isFlavorEditing', false);
        });
      } else {
        flavor.save().then(function() {
          event('Successfully modified flavor "' + flavor.get('name') + '".', Health.SUCCESS);
          Ember.$('.modal:visible').modal('hide');
          self.set('isFlavorEditing', false);
        }, function(xhr) {
          xhrError(xhr, 'An error occurred while attempting to modify flavor "' + flavor.get('name') + '".');
          self.set('isFlavorEditing', false);
        });
      }
    }
  }
});
