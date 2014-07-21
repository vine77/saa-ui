import Ember from 'ember';
import FormController from './form';
import Health from '../utils/mappings/health';
import notify from '../utils/notify';
import xhrError from '../utils/xhr-error';

// TODO: Migrate Sunil's authentication code
export default FormController.extend({
  needs: ['login'],
  getMailServer: false,
  //getEmail: true,
  getEmail: false,
  redirectOnSave: '',
  username: '',
  oldPassword: '',
  newPassword1: '',
  newPassword2: '',
  email: '',
  message: 'You are required to change your password. Please enter a new password below.',
  isPending: false,
  id: '#profile',
  validated_fields: ['oldPassword', 'newPassword1', 'newPassword2'],
  reset_fields: ['oldPassword', 'newPassword1', 'newPassword2'],
  fieldname: {
    username: 'user name',
    oldPassword: 'current password',
    newPassword1: 'new password',
    newPassword2: 'new password',
    email: 'user email'
  },
  initFields: function(model) {
    this.set('username', model.get('username'));
    this.set('email', model.get('email'));
    this.set('oldPassword', this.get('controllers.login.password'));
    this.set('newPassword1', '');
    this.set('newPassword2', '');
  },
  saveProfile: function(route) {
    var self = this;
    var user = this.get('model');
    if (this.get('newPassword1') != this.get('newPassword2')) {
      this.showNotification('Passwords do not match. Please try again.');
      this.set('newPassword1', '');
      this.set('newPassword2', '');
      Ember.$('#profile-newPassword1').focus();
    } else {
      /*
      var email_configured = (this.email != '');
      email_configured = (this.email != '');
      if (this.getMailServer) {
        var mailServerValid = true;
        var mail_controller = route.controllerFor('settings.mailserver');
        mailServerValid = mail_controller.saveConfig(route, false);
        if (!mailServerValid) {
          email_configured = false;
        }
      }
      if (!email_configured) {
        var message = 'A valid email is needed to recover if you forget the password. Are you sure you want to continue without this configured?';
        if (!confirm(message)) return false;
      }
      */
      user.setProperties({
        username: this.get('username'),
        oldPassword: this.get('oldPassword'),
        newPassword: this.get('newPassword1'),
        email: this.get('email')
      });
      this.set('isPending', true);
      return user.save().then(function() {
        var session = self.store.createRecord('session', {
          username: self.get('controllers.login.username'),
          password: self.get('newPassword1')
        });
        return session.save().then(function(session) {
          self.set('isPending', false);
          self.get('controllers.login').set('csrfToken', session.get('csrfToken'));
          self.get('controllers.login').set('loggedIn', true);
          self.get('controllers.login').transitionToAttempted();
          notify('The user profile was updated successfully.', Health.SUCCESS);
        });
      }, function(xhr) {
        self.set('isPending', false);
        xhrError(xhr, 'An error occurred while attempting to update the user profile.');
      });
    }
  },
  sendTestEmail: function(route) {
    var controller = this;
    if (controller.getMailServer) {
      var updateNotification = function(msg) {
        controller.showNotification(msg);
        controller.setDisable(false);
        controller.setDisable(true, 'username');
      };
      var mail_controller = route.controllerFor('settings.mailserver');
      if (mail_controller.saveConfig(route, true, updateNotification)) {
        controller.setDisable(true);
      }
    }
  },
  resetProfile: function(route) {
    var controller = this;
    var model = this.get('model');
    controller.reset_form();
    controller.setDisable(true, 'username');
    controller.initFields(model);
    if (controller.getMailServer) {
      var mail_controller = route.controllerFor('settings.mailserver');
      mail_controller.resetConfig(route);
    }
  },
  cancel: function() {
    this.transitionToRoute('login');
  }
});
