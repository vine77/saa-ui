App.StatusController = Ember.ObjectController.extend({
  level: null,
  childRoute: function () {
    return 'status' + (this.get('level') + 1);
  }.property('level')
});
