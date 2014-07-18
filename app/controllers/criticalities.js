import Ember from 'ember';

export default Ember.ArrayController.extend({
  itemController: 'criticality',
  init: function() {
    self = this;
    this.store.find('criticality').then( function(criticalities) {
      self.set('model', self.store.find('criticality'));
    });
  }
});
