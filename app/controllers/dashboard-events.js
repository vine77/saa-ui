import Ember from 'ember';

export default Ember.ArrayController.extend({
  sortAscending: false,
  sortProperties: ['id'],
  init: function() {
    this._super();
    this.set('model', this.store.all('action'));
  }
});
