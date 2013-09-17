/**
 * Creates a filterable table
 *
 * filteredModel: Populate with underlying model data
 * filterQuery: Bind to input filter/search text
 * clearFilter: Call this action to clear filterQuery
 * filterProperties: Populate this with an array containing the strings referencing the model properties that you want to search through
 * filterModel: This is the filtered model that should be exposed to the user
 */
App.Filterable = Ember.Mixin.create({
  filteredModel: [],
  filterQuery: '',
  actions {
    clearFilter: function () {
      this.set('filterQuery', '');
    }
  },
  filterProperties: [],
  filterModel: function () {
    var controller = this;
    var searchText = this.get('filterQuery');
    if (!searchText) {
      this.set('model', this.get('filteredModel'));
    } else {
      this.set('model', this.get('filteredModel').filter(function (item, index, enumerable) {
        var thisModel = enumerable;
        var isMatched = false;
        controller.get('filterProperties').forEach(function (property, index, array) {
          var haystack = item.get(property);
          if (haystack.toLowerCase().indexOf(searchText.toLowerCase()) !== -1) {
            isMatched = true;
          }
        });
        return isMatched;
      }));
    }
  }.observes('filterQuery')
});

/**
 * Creates a sortable table
 *
 * columns: Populate this with an array of strings representing the tables column names (often corresponding to model properties)
 * sortModel: Call this action from a table header cell to sort by that column
 */
App.Sortable = Ember.Mixin.create({
  columns: [],
  sortIndex: 0,
  actions: {
    sortModel: function (column) {
      var controller = this;
      var sortIndex = 0;
      this.get('columns').forEach(function (item, index, array) {
        if (item === column) {
          controller.set('sortIndex', index);
        }
      });
      var isDifferentColumn = !this.get('sortProperties') || this.get('sortProperties')[0] !== column;
      this.set('sortProperties', [column]);
      this.set('sortAscending', (isDifferentColumn) ? true : !this.get('sortAscending'));
      this.get('columns').forEach(function (item, index, array) {
        controller.set('isColumn' + (index + 1) + 'Sorted', false);
      });
      this.set('isColumn' + (controller.sortIndex + 1) + 'Sorted', true);
    }
  }
 
});
