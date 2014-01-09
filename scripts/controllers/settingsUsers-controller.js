App.SettingsUsersController = Ember.ArrayController.extend({
  columns: ['username'],
  count: function() {
    return this.get('model.length');
  }.property('model.@each')
});
