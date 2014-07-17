App.SystemController = Ember.ArrayController.extend({
  init: function () {
    this.set('model', this.store.find('system', 'current'));
  }
});