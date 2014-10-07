App.FlavorsCreateController = Ember.ObjectController.extend({
  needs: ['flavors', 'slas', 'nodes'],

  sloTemplates: function () {
    return this.store.all('sloTemplate');
  }.property(),
  slaTypes: function() {
    return this.get('sloTemplates').map(function(item) {
      if (item) return item.get('elementName');
    }).uniq();
  }.property('sloTemplates.@each.elementName'),
  slaType: Ember.computed.alias('model.sla.type'),
  possibleSloTemplates: function() {
    var slaType = this.get('slaType');
    return this.get('sloTemplates').filter(function(sloTemplate) {
      return sloTemplate.get('elementName') === slaType;
    });
  }.property('sloTemplates.@each', 'slaType'),

  bucketSloCountGreaterThanOne: function() {
    return (this.get('bucketSloCount') >= 1);
  }.property('bucketSloCount'),
  bucketSloCount: function() {
    var computeCount = this.get('model.sla.sloTypesArray') && this.get('model.sla.sloTypesArray').filter(function(x){ return x == 'assured-scu-vcpu'; }).get('length');
    var vmComputeCount = this.get('model.sla.sloTypesArray') && this.get('model.sla.sloTypesArray').filter(function(x){ return x == 'assured-scu-vm'; }).get('length');
    var vmCoresCount = this.get('model.sla.sloTypesArray') && this.get('model.sla.sloTypesArray').filter(function(x){ return x == 'assured-cores-physical'; }).get('length');
    return computeCount + vmComputeCount + vmCoresCount;
  }.property('model.sla.sloTypesArray.@each', 'model.sla.sloTypesArray'),
  trustSloCount: function () {
    return this.get('model.sla.sloTypesArray') && this.get('model.sla.sloTypesArray').filter(function(x){ return x == 'trusted_platform'; }).get('length');
  }.property('model.sla.sloTypesArray.@each', 'model.sla.sloTypesArray'),
  isAddSloAvailable: function() {
    return !(this.get('bucketSloCount') >= 1 && this.get('trustSloCount') >= 1) && this.get('slaType');
  }.property('model.sla.sloTypesArray.@each', 'model.sla.sloTypesArray', 'bucketSloCount', 'trustSloCount', 'slaType'),

  vcpusInteger: function() {
    return ((this.get('model.vcpus'))?this.get('model.vcpus'):0);
  }.property('model.vcpus'),
  isComputeSloTable: function() {
    return this.get('model.sla.sloTypesArray') && this.get('model.sla.sloTypesArray').contains('assured-scu-vcpu');
  }.property('model.sla.sloTypesArray.@each'),
  isComputeVmSloTable: function() {
    return this.get('model.sla.sloTypesArray') && this.get('model.sla.sloTypesArray').contains('assured-scu-vm');
  }.property('model.sla.sloTypesArray.@each'),
  isExclusiveCoresSloTable: function() {
    return this.get('model.sla.sloTypesArray') && this.get('model.sla.sloTypesArray').contains('assured-cores-physical');
  }.property('model.sla.sloTypesArray.@each'),
  isSloTableVisible: function() {
    return (!!this.get('isComputeSloTable') || !!this.get('isComputeVmSloTable') || !!this.get('isExclusiveCoresSloTable'));
  }.property('isComputeSloTable', 'isComputeVmSloTable', 'isExclusiveCoresSloTable'),

 sloVcpuTableMaximumScus: function() {
    return this.get('controllers.nodes.maxScuVcpuCapabilities');
  }.property('controllers.nodes.maxScuVcpuCapabilities', 'vcpus', 'isComputeVmSloTable'),
  sloVcpuTableNumberOfNodesMaximumScus: function() {
    var self = this;
    return this.get('controllers.nodes.model').filterBy('isAssuredScuVcpu').filterBy('capabilities.max_scu_per_core').reduce( function(previousValue, item, index, enumerable) {
      return previousValue + (item.get('capabilities.max_scu_per_core') >= self.get('controllers.nodes.maxScuVcpuCapabilities'));
    }, 0);
  }.property('controllers.nodes.model.@each', 'controllers.nodes'),
  sloVcpuTableMedianScus: function() {
    return this.get('controllers.nodes.medianScuVcpuCapabilities');
  }.property('controllers.nodes.medianScuVcpuCapabilities', 'vcpus'),
  sloVcpuTableNumberOfNodesMedianScus: function() {
    var self = this;
    return this.get('controllers.nodes.model').filterBy('isAssuredScuVcpu').filterBy('capabilities.max_scu_per_core').reduce( function(previousValue, item, index, enumerable) {
      return previousValue + (item.get('capabilities.max_scu_per_core') >= self.get('controllers.nodes.medianScuVcpuCapabilities'));
    }, 0);
  }.property('controllers.nodes.model.@each'),
  sloVcpuTableMinimumScus: function() {
    return this.get('controllers.nodes.minScuVcpuCapabilities');
  }.property('controllers.nodes.minScuVcpuCapabilities', 'vcpus'),
  sloVcpuTableNumberOfNodesMinimumScus: function() {
    var self = this;
    return this.get('controllers.nodes.model').filterBy('isAssuredScuVcpu').filterBy('capabilities.max_scu_per_core').reduce( function(previousValue, item, index, enumerable) {
      return previousValue + (item.get('capabilities.max_scu_per_core') >= self.get('controllers.nodes.minScuVcpuCapabilities'));
    }, 0);
  }.property('controllers.nodes.model.@each'),

  sloVmTableMaximumScus: function() {
    return this.get('controllers.nodes.maxScuVmCapabilities') * this.get('vcpus');
  }.property('controllers.nodes.maxScuVmCapabilities', 'vcpus', 'isComputeVmSloTable'),
  sloVmTableNumberOfNodesMaximumScus: function() {
    var self = this;
    return this.get('controllers.nodes.model').filterBy('isAssuredScuVm').filterBy('capabilities.max_scu_per_core').reduce( function(previousValue, item, index, enumerable) {
      return previousValue + (item.get('capabilities.max_scu_per_core') >= self.get('controllers.nodes.maxScuVmCapabilities'));
    }, 0);
  }.property('controllers.nodes.model.@each', 'controllers.nodes'),
  sloVmTableMedianScus: function() {
    return this.get('controllers.nodes.medianScuVmCapabilities') * this.get('vcpus');
  }.property('controllers.nodes.medianScuVmCapabilities', 'vcpus'),
  sloVmTableNumberOfNodesMedianScus: function() {
    var self = this;
    return this.get('controllers.nodes.model').filterBy('isAssuredScuVm').filterBy('capabilities.max_scu_per_core').reduce( function(previousValue, item, index, enumerable) {
      return previousValue + (item.get('capabilities.max_scu_per_core') >= self.get('controllers.nodes.maxScuVmCapabilities'));
    }, 0);
  }.property('controllers.nodes.model.@each'),
  sloVmTableMinimumScus: function() {
    return this.get('controllers.nodes.minScuVmCapabilities') * this.get('vcpus');
  }.property('controllers.nodes.minScuVmCapabilities', 'vcpus'),
  sloVmTableNumberOfNodesMinimumScus: function() {
    var self = this;
    return this.get('controllers.nodes.model').filterBy('isAssuredScuVm').filterBy('utilization.cores.system.max').reduce( function(previousValue, item, index, enumerable) {
      return previousValue + (item.get('utilization.cores.system.max') >= self.get('controllers.nodes.minScuVmCapabilities'));
    }, 0);
  }.property('controllers.nodes.model.@each'),

  sloExclusiveCoresTableMaximum: function() {
    return this.get('controllers.nodes.maxCoreCapabilities');
  }.property('controllers.nodes.maxCoreCapabilities', 'vcpus', 'isExclusiveCoresSloTable'),
  sloExclusiveCoresTableNumberOfNodesMaximum: function() {
    var self = this;
    return this.get('controllers.nodes.model').filterBy('isAssuredCoresPhysical').reduce( function(previousValue, item, index, enumerable) {
      return previousValue + (item.get('utilization.cores.system.max') >= self.get('controllers.nodes.maxCoreCapabilities'));
    }, 0);
  }.property('controllers.nodes.model.@each', 'controllers.nodes'),
  sloExclusiveCoresTableMedian: function() {
    return this.get('controllers.nodes.medianCoreCapabilities');
  }.property('controllers.nodes.medianCoreCapabilities', 'vcpus'),
  sloExclusiveCoresTableNumberOfNodesMedian: function() {
    var self = this;
    return this.get('controllers.nodes.model').filterBy('isAssuredCoresPhysical').filterBy('utilization.cores.system.max').reduce( function(previousValue, item, index, enumerable) {
      return previousValue + (item.get('utilization.cores.system.max') >= self.get('controllers.nodes.medianCoreCapabilities'));
    }, 0);
  }.property('controllers.nodes.model.@each'),
  sloExclusiveCoresTableMinimum: function() {
    return this.get('controllers.nodes.minCoreCapabilities');
  }.property('controllers.nodes.minCoreCapabilities', 'vcpus'),
  sloExclusiveCoresTableNumberOfNodesMinimum: function() {
    var self = this;
    return this.get('controllers.nodes.model').filterBy('isAssuredCoresPhysical').reduce( function(previousValue, item, index, enumerable) {
      return previousValue + (item.get('capabilities.cores_per_socket') >= self.get('controllers.nodes.minCoreCapabilities'));
    }, 0);
  }.property('controllers.nodes.model.@each'),

  isFlavorCreating: false,
  flavorsWithoutSlas: function () {
    return this.get('controllers.flavors').filterBy('sla', null);
  }.property('controllers.flavors.@each.sla'),
  slas: function () {
    return this.get('controllers.slas').filterBy('deleted', false).filterBy('isDirty', false);
  }.property('controllers.slas.@each', 'controllers.slas.@each.deleted'),
  hasNoSla: function () {
    return this.get('model.sla') === null;
  }.property('model.sla'),
  hasExistingSla: function () {
    return this.get('model.sla.isDirty') === false;
  }.property('model.sla'),
  hasNewSla: function () {
    return this.get('model.sla.isDirty') === true;
  }.property('model.sla'),
  selectedExistingSla: null,
  storeExistingSla: function () {
    if (this.get('model.sla') && !this.get('model.sla.isDirty')) {
      this.set('selectedExistingSla', this.get('model.sla'));
    }
  },
  actions: {
    selectSlaType: function (slaType) {
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
    addSlo: function () {
      this.get('model.sla.slos').addObject(this.store.createRecord('slo', {id: App.uuid()}));
    },
    deleteSlo: function (slo) {
      slo.clearInverseRelationships();
    },
    createFlavor: function () {
      var self = this;
      if (this.get('isFlavorCreating')) return;
      this.set('isFlavorCreating', true);
      var flavor = this.get('model');
      var sla = flavor.get('sla');
      var slos = (sla) ? sla.get('slos') : [];
      if (sla && sla.get('isDirty')) {
        sla.save().then(function () {
          return flavor.save();
        }).then(function () {
          App.event('Successfully created flavor "' + flavor.get('name') + '".', App.SUCCESS);
          $('.modal:visible').modal('hide');
          self.set('isFlavorCreating', false);
        }).fail(function (xhr) {
          App.xhrError(xhr, 'An error occurred while attempting to create flavor "' + flavor.get('name') + '".');
          self.set('isFlavorCreating', false);
        });
        // TODO: Add special case where SLA creation succeeds, but flavor creation fails?
      } else {
        flavor.save().then(function () {
          App.event('Successfully created flavor "' + flavor.get('name') + '".', App.SUCCESS);
          $('.modal:visible').modal('hide');
          self.set('isFlavorCreating', false);
        }, function (xhr) {
          App.xhrError(xhr, 'An error occurred while attempting to create flavor "' + flavor.get('name') + '".');
          self.set('isFlavorCreating', false);
        });
      }
    }
  }
});
