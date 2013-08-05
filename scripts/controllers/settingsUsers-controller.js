App.SettingsUsersController = Ember.ArrayController.extend(App.Filterable, App.Sortable, {
 // sortProperties: ['name'],
  columns: ['username'],
  
  editProfile: function(user) {
    App.login.set('username', user.get('username'));
    App.login.set('email', user.get('email'));
    this.transitionToRoute('profile');
  },

  count: function() {
    return this.get('length');
  }.property('model.@each'),
       
});
