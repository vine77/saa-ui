App.ProfileController = Ember.Controller.extend({
  notification:'',  
  showNotification: function(message) {
    this.set('notification', message);
    $('#profile-notification').show();
  },
  hideNotification: function(message) {
    $('#profile-notification').hide();  
  },
  setDisable: function(state, element) {
    if (typeof element === 'undefined') element = '';
    $('#profile ' + element + ' :input').prop('disabled', state);
  },
  save: function() {
      var controller = this;
      var isValid = true;
      controller.hideNotification();
      var fields = ['#profile-username', '#profile-old_password', '#profile-new_password_1', '#profile-new_password_2', '#profile-email'];
      var types = ['username', 'password', 'password', 'password', 'email'];
      for (var i=0; i < fields.length; i++) {
        if (!$(fields[i]).val()) {
          $(fields[i]).tooltip({
            title: 'Please enter a ' + types[i] + '.',
            placement: 'right',
            trigger: 'manual'
          }).tooltip('show');
          isValid = false;
        }
      }
      if (!isValid) return;

      var username = App.login.get('username');
      var old_password = App.login.get('oldPassword');
      var new_password = App.login.get('newPassword1');
      var new_password_2 = App.login.get('newPassword2');
      var email = App.login.get('email');
      App.login.set('oldPassword', '');
      App.login.set('newPassword1', '');
      App.login.set('newPassword2', '');
      
      if (new_password != new_password_2) {
        controller.showNotification("Passwords don't match");
        return;
      }

      controller.setDisable(true);
      var user = App.User.find(username);

      var setProfile = function () {
        user.set('oldPassword', old_password);
        user.set('newPassword', new_password);
        user.set('email', email);
        user.on('didUpdate', function () {
          App.login.set('message', "Profile updated successfully");
          controller.showNotification("Profile updated successfully");
          controller.setDisable(false);
          if(App.login.get('retPath') != '') {
            controller.transitionToRoute(App.login.get('retPath'));
            App.login.set('retPath','');
          }
          user.reload();
          user.off('didLoad');
          user.off('didUpdate');
          user.off('becameError');          
        });
        user.on('becameError', function () {
          controller.showNotification("Unable to save profile");
          controller.setDisable(false);
          this.get('stateManager').transitionTo('loaded.saved');          
          this.reload();
          user.off('didLoad');
          user.off('didUpdate');
          user.off('becameError');          
        });
        user.get('transaction').commit();
      };

      if (user.get('isLoaded')) {
        setProfile();
      } else {
        user.on('didLoad', setProfile);
        user.on('becameError', function () {
          controller.showNotification("Unable to save profile");
          controller.setDisable(false);
          this.get('stateManager').transitionTo('loaded.saved');          
          this.reload();
          user.off('didLoad');
          user.off('didUpdate');
          user.off('becameError');          
        });
        user.get('transaction').commit();
      }
      
      if(App.login.get('configMailServer')) {
        App.mailserver.set('test_config', false);      
        App.mailserver.save();
        App.login.set('configMailServer', false);
      }
  },
  test_email: function() {
    App.mailserver.set('test_config', true);
    App.mailserver.save()
  }  
});
