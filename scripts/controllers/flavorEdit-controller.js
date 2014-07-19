App.FlavorEditController = Ember.ObjectController.extend({
  needs: ['flavors', 'slas', 'nodes'],

  isComputeSloTable: function() {
    return this.get('model.sla.sloTypesArray').contains('compute');
  }.property('model.sla.sloTypesArray.@each'),
  isComputeVmSloTable: function() {
    return this.get('model.sla.sloTypesArray').contains('vm_compute');
  }.property('model.sla.sloTypesArray.@each'),
  isExclusiveCoresSloTable: function() {
    return this.get('model.sla.sloTypesArray').contains('vm_cores');
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
    return this.get('controllers.nodes.maxScuCapabilities') * this.get('model.vcpus');
  }.property('controllers.nodes.maxScuCapabilities', 'model.vcpus', 'isComputeVmSloTable'),
  sloVmTableNumberOfNodesMaximumScus: function() {
    var self = this;
    return this.get('controllers.nodes.model').filterBy('isAssured').filterBy('capabilities.max_scu_per_core').reduce( function(previousValue, item, index, enumerable) {
      return previousValue + (item.get('capabilities.max_scu_per_core') >= self.get('controllers.nodes.maxScuCapabilities'));
    }, 0);
  }.property('controllers.nodes.model.@each', 'controllers.nodes'),
  sloVmTableMedianScus: function() {
    return this.get('controllers.nodes.medianScuCapabilities') * this.get('model.vcpus');
  }.property('controllers.nodes.medianScuCapabilities', 'model.vcpus'),
  sloVmTableNumberOfNodesMedianScus: function() {
    var self = this;
    return this.get('controllers.nodes.model').filterBy('isAssured').filterBy('capabilities.max_scu_per_core').reduce( function(previousValue, item, index, enumerable) {
      return previousValue + (item.get('capabilities.max_scu_per_core') >= self.get('controllers.nodes.maxScuCapabilities'));
    }, 0);
  }.property('controllers.nodes.model.@each'),
  sloVmTableMinimumScus: function() {
    return this.get('controllers.nodes.minScuCapabilities') * this.get('model.vcpus');
  }.property('controllers.nodes.minScuCapabilities', 'model.vcpus'),
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
  flavorsWithoutSlas: function () {
    return this.get('controllers.flavors').filterBy('sla', null);
  }.property('controllers.flavors.@each.sla'),
  slas: function () {
    return this.get('controllers.slas').filterBy('deleted', false).filterBy('isDirty', false);
  }.property('controllers.slas.@each', 'controllers.slas.@each.deleted'),
  sloTemplates: function () {
    return this.store.all('sloTemplate');
  }.property(),
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
    editFlavor: function () {
      var self = this;
      if (this.get('isFlavorEditing')) return;
      this.set('isFlavorEditing', true);
      var flavor = this.get('model');
      var sla = flavor.get('sla');
      var slos = (sla) ? sla.get('slos') : [];
      if (sla && sla.get('isDirty')) {
        sla.save().then(function () {
          return flavor.save();
        }).then(function () {
          App.event('Successfully modified flavor "' + flavor.get('name') + '".', App.SUCCESS);
          $('.modal:visible').modal('hide');
          self.set('isFlavorEditing', false);
        }, function (xhr) {
          App.xhrError(xhr, 'An error occurred while attempting to modify flavor "' + flavor.get('name') + '".');
          self.set('isFlavorEditing', false);
        });
      } else {
        flavor.save().then(function () {
          App.event('Successfully modified flavor "' + flavor.get('name') + '".', App.SUCCESS);
          $('.modal:visible').modal('hide');
          self.set('isFlavorEditing', false);
        }, function (xhr) {
          App.xhrError(xhr, 'An error occurred while attempting to modify flavor "' + flavor.get('name') + '".');
          self.set('isFlavorEditing', false);
        });
      }
    }
  }
});
