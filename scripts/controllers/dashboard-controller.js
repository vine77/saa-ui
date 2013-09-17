App.DashboardController = Ember.ArrayController.extend({
  actions: {
    deleteEvent: function (id) {
      App.Event.find(id).deleteRecord();
    }
  }
});
