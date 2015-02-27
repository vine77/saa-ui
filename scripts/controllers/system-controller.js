App.SystemController = Ember.ArrayController.extend({
  init: function () {
    this._super();
    this.set('model', this.store.find('system', 'current'));
  }
});
