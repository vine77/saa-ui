App.FlavorsCreateController = Ember.ObjectController.extend({
  needs: ['slas'],
  name: '',
  sourceFlavor: null,
  sla: null,
  isFlavorCreating: false,
  flavorsWithoutSlas: function () {
    return this.get('model').filterBy('sla', null);
  }.property('model.@each.sla'),
  slas: function () {
    return this.get('controllers.slas.model');
  }.property('controllers.slas.model.@each'),
  actions: {
    createFlavor: function () {
      var self = this;
      if (this.get('isFlavorCreating')) return;
      this.set('isFlavorCreating', true);
      flavor = this.store.createRecord('flavor', {
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
