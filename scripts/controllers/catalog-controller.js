App.CatalogController = Ember.ArrayController.extend(App.Filterable, App.Sortable, {
  columns: ['select', 'name', 'version', 'description', 'numberOfVms', 'actions', 'expand'],
  filteredModel: function () {
    return App.Template.find();
  }.property('App.Template.@each'),
  filterProperties: ['name', 'description'],
  actions {
    selectAll: function () {
      var isEverythingSelected = this.get('model').everyProperty('isSelected');
      this.get('model').setEach('isSelected', !isEverythingSelected);
    }
  },
  multipleTemplatesAreSelected: function () {
    return this.get('model').filterProperty('isSelected').length > 1;
  }.property('model.@each.isSelected'),
  actions: {
    expand: function (model) {
      if (!model.get('isActive')) {
        this.transitionToRoute('template', model);
      } else {
        this.transitionToRoute('catalog');
      }
    }
  }

});
