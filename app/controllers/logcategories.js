import Ember from 'ember';

export default Ember.ArrayController.extend({
  itemController: 'logcategory',
  init: function() {
    var self = this;
    this.store.find('log', 'current').then( function(log) {
      self.set('model', log.get('categories'));
    });
  }
});
