import Ember from 'ember';

/**
 * Mixin for a columns ArrayController to be paired with a Sortable "parent" ArrayController
 * Note: Must be conventionally named with "ColumnsController" appended to the "parent" controller name,
 * e.g. NodesColumnsController if "parent" is NodesColumnsController
 */
// TODO: Need to change this "conventionally named" controller
export default Ember.ArrayController.extend({
  init: function() {
    this._super();
    var self = this;
    // Generate an itemController for this ArrayController using conventional naming
    // TODO: Migrate away from global App
    window.App[self.get('parent').capitalize() + 'ColumnController'] = Ember.ObjectController.extend({
      needs: [self.get('parent')],
      isSorted: function() {
        return this.get('sortBy') === this.get('controllers.' + self.get('parent') + '.sortProperty');
      }.property('sortBy', 'controllers.' + self.get('parent') + '.sortProperty')
    });
  },
  parent: function() {
    var name = this.constructor.toString();
    if (name.indexOf('controller:') === -1) throw new Error('Object extended by mixin must be a controller');
    if (name.indexOf('-columns') === -1) throw new Error('Controller extended by mixin must be a be named ...-columns');
    name = name.slice(name.indexOf('controller:') + 11).split(':')[0];
    return name.slice(0, name.indexOf('-columns'));
  }.property(),
  needs: function() {
    return [this.get('parent')];
  }.property('parent'),
  itemController: function() {
    return this.get('parent') + 'Column';
  }.property('parent'),
  tableController: function() {
    return this.get('controllers.' + this.get('parent'));
  }.property('parent'),
  actions: {
    sort: function(column, sortAscending) {
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
