App.SettingsUsersController = Ember.ArrayController.extend({
 // sortProperties: ['name'],
  columns: ['username'],

  editProfile: function(user) {
    this.transitionToRoute('profile');
  },

  count: function() {
    return this.get('length');
  }.property('model.@each'),

});
