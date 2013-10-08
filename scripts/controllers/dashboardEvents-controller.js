App.DashboardEventsController = Ember.ArrayController.extend({
  sortAscending: false,
  sortProperties: ['id'],
  init: function () {
    var controller = this;
    controller._super();
    this.store.find('event').then(function (events) {
      controller.set('model', events);
    });
  }
});
