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
      flavor = App.Flavor.createRecord({
        name: controller.get('name'),
        sla: controller.get('sla'),
        sourceFlavor: controller.get('sourceFlavor')
      });
      flavor.get('transaction').commit();
      flavor.on('becameError', function () {
        var errorMessage = (flavor.get('error')) ? flavor.get('error') : 'An error occured while creating this flavor. Please try again.';
        App.event(errorMessage, App.ERROR);
        flavor.get('stateManager').transitionTo('rootState.loaded.created.uncommitted');
        flavor.deleteRecord();
        controller.set('isFlavorCreating', false);
      });
      flavor.on('becameInvalid', function () {
        var errorMessage = (flavor.get('error')) ? flavor.get('error') : 'An error occured while creating this flavor. Please try again.';
        App.event(errorMessage, App.WARNING);
        flavor.get('stateManager').transitionTo('rootState.loaded.created.uncommitted');
        flavor.deleteRecord();
        controller.set('isFlavorCreating', false);
      });
      flavor.on('didCreate', function () {
        App.event('Successfully created flavor "' + flavor.get('name') + '"', App.SUCCESS);
        $('.modal:visible').modal('hide');
        // Clear form
        controller.set('name', '');
        controller.set('sourceFlavor', null);
        controller.set('sla', null);
        controller.set('isFlavorCreating', false);
      });
    }
  }
});
