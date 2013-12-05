App.SlasCreateController = Ember.ObjectController.extend({
  isSlaCreating: false,
  sloTemplates: function () {
    return this.store.all('sloTemplate');
  }.property(),
  actions: {
    addSlo: function () {
      this.get('model.slos').addObject(this.store.createRecord('slo', {id: App.uuid()}));
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
    createSla: function () {
      var self = this;
      if (this.get('isSlaCreating')) return;
      this.set('isSlaCreating', true);
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
        App.event('Successfully created SLA "' + sla.get('name') + '".', App.SUCCESS);
        $('.modal:visible').modal('hide');
        self.set('isSlaCreating', false);
      }, function (xhr) {
        App.xhrError(xhr, 'An error occurred while attempting to create SLA "' + sla.get('name') + '".');
        self.set('isSlaCreating', false);
      });
    }
  }
});
