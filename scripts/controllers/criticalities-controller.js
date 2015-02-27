App.CriticalitiesController = Ember.ArrayController.extend({
  itemController: 'criticality',
  init: function() {
    var self = this;
    this._super();
    this.store.find('criticality').then( function(criticalities) {
      self.set('model', self.store.find('criticality'));
    });
  }
});
