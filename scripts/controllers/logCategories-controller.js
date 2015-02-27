App.LogcategoriesController = Ember.ArrayController.extend({
  itemController: 'logcategory',
  init: function() {
    var self = this;
    this._super();
    this.store.find('log', 'current').then( function(log) {
      self.set('model', log.get('categories'));
    });
  }
});
