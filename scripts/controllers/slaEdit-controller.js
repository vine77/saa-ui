App.SlaEditController = Ember.ObjectController.extend({
  needs: ['nodes'],

  sloTemplates: function () {
    return this.store.all('sloTemplate');
  }.property(),
  slaTypes: function() {
    return this.get('sloTemplates').map(function(item) {
      if (item) return item.get('elementName');
    }).uniq();
  }.property('sloTemplates.@each.elementName'),
  slaType: Ember.computed.alias('model.slaType'),
  possibleSloTemplates: function() {
    return this.get('sloTemplates');
    return this.get('sloTemplates').filter(function(sloTemplate) {
      return sloTemplate.get('elementName') === slaType;
    });
  }.property('sloTemplates.@each', 'slaType', 'slos.@each'),

  bucketSloCountGreaterThanOne: function() {
    return (this.get('bucketSloCount') >= 1);
  }.property('bucketSloCount'),
  bucketSloCount: function() {
    var computeCount = this.get('sloTypesArray') && this.get('sloTypesArray').filter(function(x){ return x == 'assured-scu-vcpu'; }).get('length');
    var vmComputeCount = this.get('sloTypesArray') && this.get('sloTypesArray').filter(function(x){ return x == 'assured-scu-vm'; }).get('length');
    var vmCoresCount = this.get('sloTypesArray') && this.get('sloTypesArray').filter(function(x){ return x == 'assured-cores-physical'; }).get('length');
    return computeCount + vmComputeCount + vmCoresCount;
  }.property('sloTypesArray.@each', 'sloTypesArray'),
  trustSloCount: function () {
    return this.get('sloTypesArray') && this.get('sloTypesArray').filter(function(x){ return x == 'trusted_platform'; }).get('length');
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

  isSlaEditing: false,
  actions: {
    addSlo: function () {
      this.get('model.slos').addObject(this.store.createRecord('slo', {id: App.uuid()}));
    },
    deleteSlo: function (slo) {
      slo.clearInverseRelationships();
    },
    editSla: function () {
      var self = this;
      if (this.get('isSlaEditing')) return;
      this.set('isSlaEditing', true);
      var sla = this.get('model');
      var slos = this.get('slos');
      /*
      sloPromises = [];
      slos.forEach(function (slo) {
        sloPromises.push(slo.save());
      });
      Ember.RSVP.all(sloPromises).then(function () {
        return sla.save();
      }).then(function () {
      */
      sla.save().then(function () {
        App.event('Successfully modified SLA "' + sla.get('name') + '".', App.SUCCESS);
        $('.modal:visible').modal('hide');
        self.set('isSlaEditing', false);
      }, function (xhr) {
        App.xhrError(xhr, 'An error occurred while attempting to modify SLA "' + sla.get('name') + '".');
        self.set('isSlaEditing', false);
      });
      // TODO: Manually set SLO records to saved to clear isDirty
    }
  }
});
