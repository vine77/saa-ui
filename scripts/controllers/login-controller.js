App.LoginController = Ember.Controller.extend({
  usernameBinding: 'App.login.username',
  passwordBinding: 'App.login.password',
  rememberMeBinding: 'App.login.rememberMe',
  loggedInBinding: 'App.login.loggedIn',  
  messageBinding: 'App.login.message',  
  editProfileBinding: 'App.login.editProfile',
  changingPasswordBinding: 'App.login.changingPassword',
  configMailServerBinding: 'App.login.configMailServer',
  resetPasswordBinding: 'App.login.resetPassword',
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
  },
  forgot_password: function(){
    App.login.set('resetPassword', true);
    this.showNotification('Please confirm user name');
  },
  reset: function(){
      var controller = this;
      username = App.login.get('username')
      var user = App.User.find(username);
      controller.setDisable(true);

      var resetPassword = function () {
        if(user.get('resetPassword')){
            user.reload();
        }
        user.set('resetPassword', true);
        user.on('didUpdate', function () {
          App.login.set('resetPassword', false);
          user.set('resetPassword', false);
          controller.setDisable(false);
          controller.showNotification("A temporary password has been generated and emailed.");
          user.off('didLoad');
          user.off('didUpdate');
          user.off('becameError');
        });
        user.on('becameError', function () {
          App.login.set('resetPassword', false);
          controller.setDisable(false);
          controller.showNotification("Failed to generate temporary password.");
          this.get('stateManager').transitionTo('loaded.saved');          
          this.reload().then(function(){
          user.set('resetPassword', false);
          });
          user.off('didLoad');
          user.off('didUpdate');
          user.off('becameError');
        });
        user.get('transaction').commit();
      };

      if (user.get('isLoaded')) {
        resetPassword();
      } else {
        user.on('didLoad', resetPassword);
        user.on('becameError', function () {
          controller.setDisable(false);
          controller.showNotification("Failed to generate temporary password.");
          this.get('stateManager').transitionTo('loaded.saved');          
          this.reload();
          App.login.set('resetPassword', false);
          user.set('resetPassword', false);
          user.off('didLoad');
          user.off('didUpdate');
          user.off('becameError');
        });
        user.get('transaction').commit();
      }
  }
});
