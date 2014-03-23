App.SlasCreateController = Ember.ObjectController.extend({
  needs: ['nodes'],
  isSlaCreating: false,
  sloTemplates: function () {
    return this.store.all('sloTemplate');
  }.property(),
  actions: {
    addSlo: function () {
      this.get('model.slos').addObject(this.store.createRecord('slo', {id: App.uuid()}));
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
        App.xhrError(xhr, 'An error occurred while attempting to create SLA "' + sla.get('name') + '".');
        self.set('isSlaCreating', false);
      });
    }
  }
});


