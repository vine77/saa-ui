App.State = Ember.Object.extend({
  loggedIn: false,
  route: 'dashboard',
  context: null
});
App.state = App.State.create();
