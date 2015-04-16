App.FlavorEditController = Ember.ObjectController.extend({
  needs: ['flavors', 'slas', 'nodes'],

  sloTemplates: function () {
    return this.store.all('sloTemplate');
  }.property(),
  slaTypes: function() {
    return this.get('sloTemplates').map(function(item) {
      if (item) return item.get('elementName');
    }).uniq().map(function(item) {
      return {
        value: item,
        label: item,
        disabled: item === 'os',
        visible: item !== 'os'
      };
    });
  }.property('sloTemplates.@each.elementName'),
  slaType: Ember.computed.alias('model.sla.type'),
  possibleSloTemplates: function() {
    var slaType = this.get('slaType');
    var self = this;
    return this.get('sloTemplates').filter(function(sloTemplate) {
      return sloTemplate.get('elementName') === slaType;
    }).uniq().map(function(item) {
      if (App.isComputeSlo(item.get('sloType'))) {
        var isDisabled = self.get('bucketSloCountGreaterThanOne');
      } else if (App.isTrustSlo(item.get('sloType'))) {
        var isDisabled = (self.get('trustSloCount') >= 1);
      } else {
        var isDisabled = false;
      }
      item.disabled = isDisabled;
      return item;
    });
  }.property('sloTemplates.@each', 'slaType', 'isAddSloAvailable'),

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
  isSloTableVisible: function() {
    return (!!this.get('isComputeSloTable') || !!this.get('isComputeVmSloTable') || !!this.get('isExclusiveCoresSloTable'));
  }.property('isComputeSloTable', 'isComputeVmSloTable', 'isExclusiveCoresSloTable'),

  isFlavorEditing: false,
  flavorsWithoutSlas: function () {
    return this.get('controllers.flavors').filterBy('sla', null);
  }.property('controllers.flavors.@each.sla'),
  slas: function () {
    return this.get('controllers.slas').filterBy('deleted', false).filterBy('isDirty', false).filterBy('type', 'vm');
  }.property('controllers.slas.@each', 'controllers.slas.@each.deleted'),
  availableSlas: function() {
    return this.get('slas').filterBy('isDefault', false).addObject(this.get('sla'));
  }.property('slas', 'sla'),
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
        if (!newSla) {
          newSla = this.store.createRecord('sla', {
            type: 'vm',
            deleted: false
          });
        }
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
