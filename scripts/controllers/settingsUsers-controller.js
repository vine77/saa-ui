App.SettingsUsersController = Ember.ArrayController.extend(App.Filterable, App.Sortable, {
 // sortProperties: ['name'],
  columns: ['username'],
  
  editProfile: function(user) {
    this.transitionToRoute('profile');
  },

  count: function() {
    return this.get('length');
  }.property('model.@each'),
       
});
