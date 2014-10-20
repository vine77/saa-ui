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
  slaType: Ember.computed.alias('model.type'),
  possibleSloTemplates: function() {
    var slaType = this.get('slaType');
    return this.get('sloTemplates').filter(function(sloTemplate) {
      return sloTemplate.get('elementName') === slaType;
    });
  }.property('sloTemplates.@each', 'slaType', 'slos.@each'),
  isApplicationSla: Ember.computed.equal('slaType', 'application'),

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
    return !(this.get('bucketSloCount') >= 1 && this.get('trustSloCount') >= 1)  && this.get('slaType');
  }.property('sloTypesArray.@each', 'sloTypesArray', 'bucketSloCount', 'trustSloCount', 'slaType'),

  vcpuValues: [0, 1, 2, 3, 4],
  vcpusInteger: 0,

  isSloTableVisible: function() {
    return (!!this.get('isComputeSloTable') || !!this.get('isComputeVmSloTable') || !!this.get('isExclusiveCoresSloTable'));
  }.property('isComputeSloTable', 'isComputeVmSloTable', 'isExclusiveCoresSloTable'),

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
