import Ember from 'ember';

/**
 * Creates a filterable table
 *
 * filterQuery: Bind to input filter/search text
 * clearFilter: Call this action to clear filterQuery
 * filterProperties: Populate this with an array containing the strings referencing the model properties that you want to search through
 * filterModel: This is the filtered model that should be exposed to the user
 */
export default Ember.Mixin.create({
  filterQuery: '',
  filterProperties: [],
  filteredModel: [],
  filterModel: function () {
    var searchText = this.get('filterQuery');
    if (!searchText) {
      this.set('filteredModel', this);
      return this;
    } else {
      var results = this.filter(function (item, index, enumerable) {
        var isMatched = false;
        this.get('filterProperties').forEach(function (property, index, array) {
          var haystack = item.get(property);
          if (haystack && haystack.toLowerCase().indexOf(searchText.toLowerCase()) !== -1) {
            isMatched = true;
          }
        });
        return isMatched;
      }, this);
      this.set('filteredModel', results);
      return results;
    }
  }.observes('this.@each'),
  debouncedFilterQueryObserver: Ember.debouncedObserver(function () {
    this.filterModel();
  }, 'filterQuery', 500),
  actions: {
    clearFilter: function () {
      this.set('filterQuery', '');
    }
  }
});
