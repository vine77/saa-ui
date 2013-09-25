App.TrustFingerprintController = Ember.ArrayController.extend(App.Filterable, App.Sortable, {
  columns: ['select', 'health', 'state', 'trusted', 'name', 'actions'],
  filteredModel: function () {
    return this.store.find('node');
  }.property('model.@each'),
  filterProperties: ['name'],
  multipleNodesAreSelected: function () {
    return this.get('model').filterProperty('isSelected').length > 1;
  }.property('model.@each.isSelected'),
  actions: {
    selectAll: function () {
      var isEverythingSelected = this.get('model').everyProperty('isSelected');
      this.get('model').setEach('isSelected', !isEverythingSelected);
    }
  }
});
