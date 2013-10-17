App.FlavorsColumnsController = App.ColumnsController.extend({
  content: [{
    title: 'Flavor Name',
    sortBy: 'name'
  }, {
    title: '# of VMs',
    sortBy: 'vms.length'
  }, {
    title: 'SLA',
    sortBy: 'sla.name'
  }, {
    title: 'Actions'
  }]
});

App.FlavorsController = Ember.ArrayController.extend(App.Filterable, App.Sortable, {
  sortProperty: 'name',
  actions: {
    selectAll: function () {
      var isEverythingSelected = this.get('model').everyProperty('isSelected');
      this.get('model').setEach('isSelected', !isEverythingSelected);
    },
    expand: function (model) {
      if (!model.get('isExpanded')) {
        this.transitionToRoute('flavor', model);
      } else {
        this.transitionToRoute('flavors');
      }
    },
    refresh: function () {
      this.store.find('flavor', undefined, true);
    },
    deleteFlavor: function (flavor) {
      var confirmedDelete = confirm('Are you sure you want to delete flavor "' + flavor.get('name') + '"?');
      if (confirmedDelete) {
        flavor.deleteRecord();
        flavor.save().then(function () {
          App.event('Successfully deleted flavor "' + flavor.get('name') + '".', App.SUCCESS);
        }, function (xhr) {
          flavor.rollback();
          App.xhrError(xhr, 'Failed to delete flavor "' + flavor.get('name') + '".');
        });
      }
    }
  },
  multipleFlavorsAreSelected: function () {
    return this.get('model').filterProperty('isSelected').length > 1;
  }.property('model.@each.isSelected'),
  slas: function () {
    return this.store.find('sla');
  }.property('model.@each'),
  flavorsWithoutSlas: function () {
    return this.store.all('flavor').filter(function (item, index, enumerable) {
      return item.get('sla') === null;
    });
  }
});
