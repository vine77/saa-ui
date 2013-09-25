App.SlasController = Ember.ArrayController.extend(App.Filterable, App.Sortable, {
  columns: ['name', 'numberOfSlos', 'sloTypes', 'actions', 'expand'],
  filteredModel: function () {
    return this.store.find('sla');
  }.property('model.@each'),
  filterProperties: ['name'],
  multipleSlasAreSelected: function () {
    return this.get('model').filterProperty('isSelected').length > 1;
  }.property('model.@each.isSelected'),
  actions: {
    selectAll: function () {
      var isEverythingSelected = this.get('model').everyProperty('isSelected');
      this.get('model').setEach('isSelected', !isEverythingSelected);
    },
    expand: function (model) {
      if (!model.get('isActive')) {
        this.transitionToRoute('sla', model);
      } else {
        this.transitionToRoute('slas');
      }
    },
    refresh: function () {
      this.store.find('sla', undefined, true);
    }
  }
});
