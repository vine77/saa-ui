App.DashboardEventsController = Ember.ArrayController.extend({
  sortAscending: false,
  sortProperties: ['id'],
  init: function () {
    controller = this;
    controller._super();
    this.store.find('event').then(function (events) {
      controller.set('model', events);
    });
  }
});
