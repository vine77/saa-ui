App.FlavorsCreateController = Ember.ObjectController.extend({
  needs: ['flavors', 'slas'],
  isFlavorCreating: false,
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
      this.get('model.sla.slos').addObject(this.store.createRecord('slo'));
    },
    deleteSlo: function (slo) {
      slo.eachRelationship(function(name, relationship){
        if (relationship.kind === 'belongsTo') {
          var inverse = relationship.parentType.inverseFor(name);
          var parent = slo.get(name);
          if (inverse && parent) parent.get(inverse.name).removeObject(slo);
        }
      });
      slo.deleteRecord();
    },
    createFlavor: function () {
      alert('Create Flavor...');
      return;
      var self = this;
      if (this.get('isFlavorCreating')) return;
      this.set('isFlavorCreating', true);
      var flavor = this.store.createRecord('flavor', {
        name: self.get('name'),
        sla: self.get('sla'),
        sourceFlavor: self.get('sourceFlavor')
      });
      flavor.save().then(function () {
        App.event('Successfully create flavor "' + flavor.get('name') + '".', App.SUCCESS);
        // Clear form
        $('.modal:visible').modal('hide');
        self.set('name', '');
        self.set('sourceFlavor', null);
        self.set('sla', null);
        self.set('isFlavorCreating', false);
        self.transitionToRoute('flavor', flavor);
      }, function (xhr) {
        App.xhrError(xhr, 'An error occurred while attempting to create flavor "' + flavor.get('name') + '".');
        flavor.deleteRecord();
        self.set('isFlavorCreating', false);
      });
    }
  }
});
