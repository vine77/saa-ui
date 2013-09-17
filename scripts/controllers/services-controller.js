App.ServicesController = Ember.ArrayController.extend(App.Filterable, App.Sortable, {
  columns: ['select', 'health', 'state', 'name', 'description', 'numberOfVms', 'created', 'updated', 'actions', 'expand'],
  filteredModel: function () {
    return App.Service.find();
  }.property('App.Service.@each'),
  filterProperties: ['name', 'description'],
  actions: {
    selectAll: function () {
      var isEverythingSelected = this.get('model').everyProperty('isSelected');
      this.get('model').setEach('isSelected', !isEverythingSelected);
    },
    expand: function (model) {
      if (!model.get('isActive')) {
        this.transitionToRoute('service', model);
      } else {
        this.transitionToRoute('services');
      }
    }
  },
  multipleServicesAreSelected: function () {
    return this.get('model').filterProperty('isSelected').length > 1;
  }.property('model.@each.isSelected')

});
