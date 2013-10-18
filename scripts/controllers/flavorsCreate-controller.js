App.FlavorsCreateController = Ember.ObjectController.extend({
  name: '',
  sourceFlavor: null,
  sla: null,
  isFlavorCreating: false,
  flavorsWithoutSlas: function () {
    return this.store.all('flavor').filter(function (item, index, enumerable) {
      return item.get('sla') === null;
    })
  }.property('model.@each'),
  slas: function () {
    return this.store.find('sla');
  }.property('model.@each'),
  actions: {
    createFlavor: function () {
      var self = this;
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
      }, function (xhr) {
        App.xhrError(xhr, 'An error occurred while attempting to create flavor "' + flavor.get('name') + '".');
        flavor.deleteRecord();
        self.set('isFlavorCreating', false);
      });
    }
  }
});
