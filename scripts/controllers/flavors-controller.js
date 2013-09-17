App.FlavorsController = Ember.ArrayController.extend(App.Filterable, App.Sortable, {
  columns: ['name', 'numberOfVms', 'sla', 'actions', 'expand'],
  filteredModel: function () {
    return App.Flavor.find();
  }.property('App.Flavor.@each'),
  filterProperties: ['name'],
  actions: {
    selectAll: function () {
      var isEverythingSelected = this.get('model').everyProperty('isSelected');
      this.get('model').setEach('isSelected', !isEverythingSelected);
    },
    expand: function (model) {
      if (!model.get('isActive')) {
        this.transitionToRoute('flavor', model);
      } else {
        this.transitionToRoute('flavors');
      }
    },
    refresh: function () {
      App.Flavor.find(undefined, true);
    },
    deleteFlavor: function (flavor) {
      var confirmedDelete = confirm('Are you sure you want to delete flavor "' + flavor.get('name') + '"?');
      if (confirmedDelete) {
        flavor.deleteRecord();
        flavor.get('transaction').commit();
      }
    }
  },
  multipleFlavorsAreSelected: function () {
    return this.get('model').filterProperty('isSelected').length > 1;
  }.property('model.@each.isSelected'),
  slas: function () {
    return App.Sla.find();
  }.property('App.Sla.@each'),
  flavorsWithoutSlas: function () {
    return App.Flavor.all().filter(function (item, index, enumerable) {
      return item.get('sla') === null;
    })
});
