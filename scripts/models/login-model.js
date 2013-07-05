App.Login = Ember.Object.extend({
  username: '',
  password: '',
  oldPassword: '',
  newPassword1: '',
  newPassword2: '',
  retPath: '',
  message: '',
  changingPassword: false,
  loggedIn: false,
  rememberMe: false
});
App.login = App.Login.create();
