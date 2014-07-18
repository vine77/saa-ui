import Ember from 'ember';

/**
 * Creates a sortable table
 *
 * columns: Populate this with an array of strings representing the tables column names (often corresponding to model properties)
 * sortModel: Call this action from a table header cell to sort by that column
 */
export default Ember.Mixin.create({
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
