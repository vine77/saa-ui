App.DashboardController = Ember.ArrayController.extend({
  actions: {
    deleteEvent: function (id) {
      this.store.find('event', id).deleteRecord();
    }
  }
});
