App.TrustFingerprintController = Ember.ArrayController.extend(App.Filterable, App.Sortable, {
  columns: ['select', 'health', 'state', 'trusted', 'name', 'actions'],
  filteredModel: function () {
    return App.Node.find();
  }.property('App.Node.@each'),
  filterProperties: ['name'],
  selectAll: function () {
    var isEverythingSelected = this.get('model').everyProperty('isSelected');
    this.get('model').setEach('isSelected', !isEverythingSelected);
  },
  multipleNodesAreSelected: function () {
    return this.get('model').filterProperty('isSelected').length > 1;
  }.property('model.@each.isSelected')
});
