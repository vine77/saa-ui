App.SlasController = Ember.ArrayController.extend(App.Filterable, App.Sortable, {
  columns: ['name', 'numberOfSlos', 'sloTypes', 'actions', 'expand'],
  filteredModel: function () {
    return App.Sla.find();
  }.property('App.Sla.@each'),
  filterProperties: ['name'],
  selectAll: function () {
    var isEverythingSelected = this.get('model').everyProperty('isSelected');
    this.get('model').setEach('isSelected', !isEverythingSelected);
  },
  multipleSlasAreSelected: function () {
    return this.get('model').filterProperty('isSelected').length > 1;
  }.property('model.@each.isSelected'),
  expand: function (model) {
    if (!model.get('isActive')) {
      this.transitionToRoute('sla', model);
    } else {
      this.transitionToRoute('slas');
    }
  },
  refresh: function () {
    App.Sla.all().clear();
    App.Sla.find();
  }
});
