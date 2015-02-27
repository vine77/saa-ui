App.QuotaController = Ember.ObjectController.extend({
  init: function () {
    var self = this;
    this._super();
    this.store.find('quota').then( function(item, index, enumerable) {
      self.set('model', item.get('firstObject'));
    });
  }
});
