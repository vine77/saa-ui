App.DashboardEventsController = Ember.ArrayController.extend({
  sortAscending: false,
  sortProperties: ['id'],
  init: function () {
    this._super();
    this.set('model', this.store.all('action'));
  }
});
