App.SlasCreateController = Ember.ObjectController.extend({
  needs: ['nodes'],

  slos: function() {
    var self = this;
    var slos = App.SlosController.create({
      container: this.container,
      parentController: self
    });
    this.get('model.slos').forEach( function(item, index, enumerable) {
      slos.pushObject(item);
    });
    return slos;
  }.property('model.slos.@each', 'model', 'model.@each'),

  testerProp: 'FOX JUMPS',
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
  slaType: Ember.computed.alias('model.type'),
  isSlaTypeSelected: Ember.computed.notEmpty('slaType'),
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
  isApplicationSla: Ember.computed.equal('slaType', 'application'),

  bucketSloCountGreaterThanOne: function() {
    return (this.get('bucketSloCount') >= 1);
  }.property('bucketSloCount', 'sloTypesArray.@each', 'sloTypesArray'),
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
    return !(this.get('bucketSloCount') >= 1 && this.get('trustSloCount') >= 1) && this.get('slaType');
  }.property('sloTypesArray.@each', 'sloTypesArray', 'bucketSloCount', 'trustSloCount', 'slaType'),

  vcpuValues: [0, 1, 2, 3, 4],
  vcpusInteger: 0,
  vcpus: 0,
  test:0,

  isSloTableVisible: function() {
    return (!!this.get('isComputeSloTable') || !!this.get('isComputeVmSloTable') || !!this.get('isExclusiveCoresSloTable'));
  }.property('isComputeSloTable', 'isComputeVmSloTable', 'isExclusiveCoresSloTable'),

  isSlaCreating: false,
  actions: {
    addSlo: function () {
      this.get('model.slos').addObject(this.store.createRecord('slo', {id: App.uuid()}));
      //this.get('slos').addObject(this.store.createRecord('slo', {id: App.uuid()}));
    },
    deleteSlo: function (slo) {
      slo.clearInverseRelationships();
    },
    createSla: function () {
      var self = this;
      if (this.get('isSlaCreating')) return;
      this.set('isSlaCreating', true);
      var sla = this.get('model');
      var slos = this.get('slos');
      sla.save().then(function () {
        App.event('Successfully created SLA "' + sla.get('name') + '".', App.SUCCESS);
        $('.modal:visible').modal('hide');
        self.set('isSlaCreating', false);
      }, function (xhr) {
        self.set('isSlaCreating', false);
        sla.transitionTo('loaded.saved');
        sla.rollback();
        App.xhrError(xhr, 'An error occurred while attempting to create SLA "' + sla.get('name') + '".');
      });
    }
  }
});


