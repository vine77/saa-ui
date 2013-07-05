App.SettingsUsersController = Ember.ArrayController.extend(App.Filterable, App.Sortable, {
 // sortProperties: ['name'],
  columns: ['username'],

  
  changePassword: function(user) {
    App.login.set('username', user.get('username'));
    App.login.set('message', '');
    App.login.set('changingPassword', true);
    App.login.set('retPath',  'settings.users');
    this.transitionToRoute('login');
  },

  count: function() {
    return this.get('length');
  }.property('model.@each'),

 // roles: function(){
 //   return App.Role.find();
 // }.property('App.Role.@each'), 

  previousValues: {},
  
  startEditing: function(user) {
     user.set('isEditing', true);
     this.set('previousValues.username', user.get('username'));
     this.set('previousValues.username', user.get('username'));
     this.set('previousValues.name', user.get('name'));
     this.set('previousValues.email', user.get('email'));
     this.set('previousValues.isEnabled', user.get('isEnabled'));
     this.set('previousValues.isAdmin', user.get('isAdmin'));
     this.set('previousValues.role', user.get('role'));
  },

  cancel: function(user) {
    user.set('isEditing', false);
    user.set('username', this.previousValues.username);
    user.set('name', this.previousValues.name);
    user.set('email', this.previousValues.email);
    user.set('isEnabled', this.previousValues.isEnabled);
    user.set('isAdmin', this.previousValues.isAdmin);
    user.set('role', this.previousValues.role);
  }, 
  
  save: function(user) {
    user.set('isEditing', false);
  }, 
  
  disable: function(user) {
    user.set('isEnabled', false);
  },
  
  enable: function(user){
   user.set('isEnabled', true);
  },  
  
  delete: function(user){
    var verify = confirm('Are you sure you want to delete?');
    if (verify) {this.removeObject(user); }
  },
   
  filteredModel: function () {
    return App.User.find();
  }.property('App.User.@each'),
 
  filterProperties: ['username']
  
});
