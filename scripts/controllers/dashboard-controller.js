App.DashboardController = Ember.ArrayController.extend({
  deleteEvent: function (id) {
    App.Event.find(id).deleteRecord();
  }
});
