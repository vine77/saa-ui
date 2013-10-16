App.CriticalitiesController = Ember.ArrayController.extend({
  itemController: 'criticality',
  init: function() {
    self = this;
    this.store.find('criticality').then( function(criticalities) {
      self.set('model', this.store.find('criticality'));
    });
  }
});