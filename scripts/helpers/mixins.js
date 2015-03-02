/**
 * Creates a filterable table
 *
 * filterQuery: Bind to input filter/search text
 * clearFilter: Call this action to clear filterQuery
 * filterProperties: Populate this with an array containing the strings referencing the model properties that you want to search through
 * filterModel: This is the filtered model that should be exposed to the user
 */
App.Filterable = Ember.Mixin.create({
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

/**
 * Creates a sortable table
 *
 * columns: Populate this with an array of strings representing the tables column names (often corresponding to model properties)
 * sortModel: Call this action from a table header cell to sort by that column
 */
App.Sortable = Ember.Mixin.create({
  self: function () {
    var name = this.constructor.toString().split('.')[1];
    if (name.indexOf('Controller') === -1) throw new Error('Name of controller extended by Mixin must end with "Controller"');
    return name.slice(0, name.indexOf('Controller')).camelize();
  }.property(),
  needs: function () {
    var needs = this._super() || [];
    needs.push(this.get('self') + 'Columns');
    return needs;
  }.property('self'),
  columns: function () {
    return this.get('controllers.' + this.get('self') + 'Columns');
  }.property('self'),
  sortProperty: null,
  sortProperties: function () {
    return (!this.get('sortProperty')) ? null : [this.get('sortProperty')];
  }.property('sortProperty'),
  sortIndex: function () {
    return this.get('columns').indexOf(this.get('sortProperty'));
  }.property('columns', 'sortProperty'),
  sortAscending: true,
  sortFunction: App.naturalSort,
  actions: {
    sortModel: function (column) {
      var isDifferentColumn = !this.get('sortProperty') || this.get('sortProperty') !== column;
      if (isDifferentColumn) {
        this.set('sortProperty', column);
        this.set('sortAscending', true);
      } else {
        this.set('sortAscending', !this.get('sortAscending'));
      }
    }
  }
});

/**
 * Mixin for a columns ArrayController to be paired with a Sortable "parent" ArrayController
 * Note: Must be conventionally named with "ColumnsController" appended to the "parent" controller name,
 * e.g. NodesColumnsController if "parent" is NodesColumnsController
 */
App.ColumnsController = Ember.ArrayController.extend({
  init: function () {
    this._super();
    var self = this;
    // Generate an itemController for this ArrayController using conventional naming
    App[self.get('parent').capitalize() + 'ColumnController'] = Ember.ObjectController.extend({
      needs: [self.get('parent')],
      isSorted: function () {
        return this.get('sortBy') === this.get('controllers.' + self.get('parent') + '.sortProperty');
      }.property('sortBy', 'controllers.' + self.get('parent') + '.sortProperty')
    });
  },
  parent: function () {
    var name = this.constructor.toString().split('.')[1];
    if (name.indexOf('ColumnsController') === -1) throw new Error('Name of controller extended by Mixin must end with "ColumnsController"');
    return name.slice(0, name.indexOf('ColumnsController')).camelize();
  }.property(),
  needs: function () {
    return [this.get('parent')];
  }.property('parent'),
  itemController: function () {
    return this.get('parent') + 'Column';
  }.property('parent'),
  tableController: function () {
    return this.get('controllers.' + this.get('parent'));
  }.property('parent'),
  actions: {
    sort: function (column, sortAscending) {
      var parent = this.get('controllers.' + this.get('parent'));
      var isDifferentColumn = !parent.get('sortProperty') || parent.get('sortProperty') !== column;
      if (isDifferentColumn) {
        parent.set('sortProperty', column);
        parent.set('sortAscending', (sortAscending === undefined) ? false : sortAscending);
      } else {
        parent.set('sortAscending', !parent.get('sortAscending'));
      }
    }
  }
});

/**
 * Mixin for fetching meta information about a model
 */
App.ModelMetaMixin = Ember.Mixin.create({
    _modelProperty: 'content', // the property on the controller to find the bound reference to the model (typically found at 'content')
    modelRef: function() {
        var property = this._modelProperty;
        return this.get(property + '.constructor');
    }.property(this._modelProperty),
    modelName: function() {
        return String(this.get('modelRef'));
    }.property(this._modelProperty),
    modelType: function() {
        var name = this.get('modelName').split('.');
        return Ember.String.camelize(name.pop());
    }.property(this._modelProperty)
});
