App.FlavorEditController = Ember.ObjectController.extend({
  needs: ['flavors', 'slas'],
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
    editFlavor: function () {
      var self = this;
      if (this.get('isFlavorEditing')) return;
      this.set('isFlavorEditing', true);
      var flavor = this.get('model');
      var sla = flavor.get('sla');
      var slos = (sla) ? sla.get('slos') : [];
      if (sla && sla.get('isDirty')) {
        sloPromises = [];
        slos.forEach(function (slo) {
          sloPromises.push(slo.save());
        });
        Ember.RSVP.all(sloPromises).then(function () {
          return sla.save();
        }).then(function () {
          return flavor.save();
        }).then(function () {
          App.event('Successfully create flavor "' + flavor.get('name') + '".', App.SUCCESS);
          $('.modal:visible').modal('hide');
          self.set('isFlavorEditing', false);
        }, function (xhr) {
          App.xhrError(xhr, 'An error occurred while attempting to create flavor "' + flavor.get('name') + '".');
          self.set('isFlavorEditing', false);
        });
      } else {
        flavor.save().then(function () {
          App.event('Successfully create flavor "' + flavor.get('name') + '".', App.SUCCESS);
          $('.modal:visible').modal('hide');
          self.set('isFlavorEditing', false);
        }, function (xhr) {
          App.xhrError(xhr, 'An error occurred while attempting to create flavor "' + flavor.get('name') + '".');
          self.set('isFlavorEditing', false);
        });
      }
    }
  }
});