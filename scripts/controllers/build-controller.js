App.BuildController = Ember.ObjectController.extend({
  init: function () {
    this._super();
    this.set('model', this.store.find('build', 'current'))
  }
});
