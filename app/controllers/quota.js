import Ember from 'ember';

export default Ember.ObjectController.extend({
  init: function() {
    this._super();
    var self = this;
    this.store.find('quota').then( function(item, index, enumerable) {
      self.set('model', item.get('firstObject'));
    });
  }
});
