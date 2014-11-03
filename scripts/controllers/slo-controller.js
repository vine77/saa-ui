App.SloController = Ember.ObjectController.extend({
  needs: ['nodes'],

  isSelected: Ember.computed.notEmpty('sloTemplate'),
  vcpuValues: [0, 1, 2, 3, 4],
  vcpus: function() {
    return this.get('parentController.vcpusInteger');
  }.property('parentController.vcpusInteger'),

  sloTemplates: function() {
    return this.get('parentController.sloTemplates');
  }.property('parentController.sloTemplates.@each', 'parentController.isAddSloAvailable'),
  possibleSloTemplates: function() {
    return this.get('parentController.possibleSloTemplates');
  }.property('parentController.possibleSloTemplates.@each', 'parentController.isAddSloAvailable'),
  allowedOperatorsGreaterThanOne: function() {
    return (this.get('model.sloTemplate.allowedOperators.length') > 1);
  }.property('model.sloTemplate.allowedOperators'),
  rangeMin: function (key, value) {
    // Setter
    if (arguments.length > 1) {
      var min = value || '';
      var range = (this.get('value') && this.get('value').indexOf(';') !== -1) ? this.get('value') : ';';
      this.set('value', min + ';' + range.split(';')[1]);
    }
    // Getter
    if (this.get('isRange') && this.get('value') && this.get('value').indexOf(';') !== -1) {
      return this.get('value').split(';')[0];
    } else {
      return '';
    }
  }.property('value'),
  rangeMax: function (key, value) {
    // Setter
    if (arguments.length > 1) {
      var max = value || '';
      var range = (this.get('value') && this.get('value').indexOf(';') !== -1) ? this.get('value') : ';';
      this.set('value', range.split(';')[0] + ';' + max);
    }
    // Getter
    if (this.get('isRange') && this.get('value') && this.get('value').indexOf(';') !== -1) {
      return this.get('value').split(';')[1];
    } else {
      return '';
    }
  }.property('value'),
  isExclusiveCoresSloTable: function() {
    return (this.get('sloTemplate.sloType') == 'assured-cores-physical');
  }.property('sloTemplate'),
  isComputeVmSloTable: function() {
    return (this.get('sloTemplate.sloType') == 'assured-scu-vm');
  }.property('sloTemplate'),
  isComputeSloTable: function() {
    return (this.get('sloTemplate.sloType') == 'assured-scu-vcpu');
  }.property('sloTemplate'),
  sloInfoExists: function () {
    return (this.get('isExclusiveCoresSloTable') || this.get('isComputeSloTable') || this.get('isComputeVmSloTable'));
  }.property('isExclusiveCoresSloTable', 'isComputeSloTable', 'isComputeVmSloTable'),
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
  sloVmTableMaximumScus: function() {
    var maxScuVmCapabilities = this.get('controllers.nodes.maxScuVmCapabilities');
    var vcpus = this.get('vcpus');
    /*
    console.log('controllers.nodes.maxScuVmCapabilities', maxScuVmCapabilities);
    console.log('vcpus', vcpus);
    console.log('maxScuVmCapabilities * vcpus', maxScuVmCapabilities * vcpus);
    */
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

});
