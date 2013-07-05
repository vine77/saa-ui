App.LoginController = Ember.Controller.extend({
  usernameBinding: 'App.login.username',
  passwordBinding: 'App.login.password',
  rememberMeBinding: 'App.login.rememberMe',
  loggedInBinding: 'App.login.loggedIn',  
  messageBinding: 'App.login.message',  
  changingPasswordBinding: 'App.login.changingPassword',
  oldPasswordBinding: 'App.login.oldPassword',
  newPassword1Binding: 'App.login.newPassword1',
  newPassword2Binding: 'App.login.newPassword2',
  showNotification: function(message) {
    App.login.set('message', message);
    $('#login-notification').show();
  },
  setDisable: function(state, element) {
    if (typeof element === 'undefined') element = '';
    $('#login ' + element + ' :input').prop('disabled', state);
  }
});
