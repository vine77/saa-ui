import Ember from 'ember';

// TODO: Port to real model
export default Ember.Object.extend({
  username: '',
  password: '',
  oldPassword: '',
  newPassword1: '',
  newPassword2: '',
  retPath: '',
  message: '',
  changingPassword: false,
  loggedIn: false,
  resetPassword: false,
  rememberMe: false
}).create();
