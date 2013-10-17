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
      this.set('isFlavorCreating', true);
      var controller = this;
      flavor = this.store.createRecord('flavor', {
        name: controller.get('name'),
        sla: controller.get('sla'),
        sourceFlavor: controller.get('sourceFlavor')
      });
      flavor.save().then(function () {
        App.event('Successfully create flavor "' + flavor.get('name') + '".', App.SUCCESS);
        this.set('isFlavorCreating', false);
        // Clear form
        $('.modal:visible').modal('hide');
        controller.set('name', '');
        controller.set('sourceFlavor', null);
        controller.set('sla', null);
        controller.set('isFlavorCreating', false);
      }, function (xhr) {
        App.xhrError(xhr, 'An error occurred while attempting to create flavor "' + flavor.get('name') + '".');
        flavor.deleteRecord();
        this.set('isFlavorCreating', false);
      });
    }
  }
});
