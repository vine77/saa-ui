// TODO: Migrate Sunil's authentication code
App.ProfileController = App.FormController.extend({
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
  errorString: function (error) {
    var errorTbl = {
      'unauthorized.' : 'Invalid password.',
      'internal server error.' : 'An internal error occured.',
    };
    var key = error.toLowerCase();
    if (typeof(errorTbl[key]) != 'undefined' ) {
      return errorTbl[key];
    } else {
      return error;
    }
  },
  fieldname: {
    username: 'user name',
    oldPassword: 'current password',
    newPassword1: 'new password',
    newPassword2: 'new password',
    email: 'user email'
  },
  initFields: function (model) {
    this.set('username', model.get('username'));
    this.set('email', model.get('email'));
    this.set('oldPassword', this.get('controllers.login.password'));
    this.set('newPassword1', '');
    this.set('newPassword2', '');
  },
  saveProfile: function (route) {
    var controller = this;
    var model = controller.get('model');
    var record = {
      'username' : controller.get('username'),
      'oldPassword' : controller.get('oldPassword'),
      'newPassword1' : controller.get('newPassword1'),
      'newPassword2' : controller.get('newPassword2'),
      'email' : controller.get('email')
    };
    if (controller.prepare_commit(record)) {
      if (controller.newPassword1 != controller.newPassword2) {
        controller.showNotification('Passwords do not match. Please try again.');
        controller.reset_form();
      } else {
        var email_configured = false;
        email_configured = (controller.email != '');
        if (controller.getMailServer) {
          var mailServerValid = true;
          var mail_controller = route.controllerFor('settings.mailserver');
          mailServerValid = mail_controller.saveConfig(route, false);
          if (!mailServerValid) {
            email_configured = false;
          }
        }
        /*
        if (!email_configured) {
          var message = 'A valid email is needed to recover if you forget the password. Are you sure you want to continue without this configured?';
          if (!confirm(message)) return false;
        }
        */
        record.newPassword = record.newPassword1;
        delete record.newPassword1;
        delete record.newPassword2;
        model.setProperties(record);

        this.set('isPending', true);

        /*
        var host = (!localStorage.apiDomain) ? '' : '//' + localStorage.apiDomain;
        var userXhr = Ember.$.ajax(host + '/api/v1/users/' + this.get('username') + '.json', {
          type: 'PUT',
          data: JSON.stringify({
            user: {
              username: this.get('username'),
              old_password: this.get('oldPassword'),
              new_password: this.get('newPassword1'),
              email: this.get('email')
            }
          }),
          contentType: 'application/json',
          dataType: 'json'
        });
        userXhr.then(function () {
          var headers = userXhr.getAllResponseHeaders();

          controller.set('isPending', false);
          controller.get('controllers.login').set('loggedIn', true);
          // TODO: Do we need the header to reset X-CSRF-Token?
          globalModel = data;
          App.notify('The user profile was updated successfully.', App.SUCCESS);
          controller.get('controllers.login').send('transitionToAttempted');
        }).fail(function (xhr) {
          controller.set('isPending', false);
          App.xhrError(xhr, 'An error occurred while attempting to update the user profile.');
        });
        */

        return model.save().then(function () {
          var session = controller.store.createRecord('session', {
            username: controller.get('controllers.login.username'),
            password: controller.get('newPassword1')
          });
          return session.save().then(function (session) {
            controller.set('isPending', false);
            controller.get('controllers.login').set('csrfToken', session.get('csrfToken'));
            controller.get('controllers.login').set('loggedIn', true);
            controller.get('controllers.login').transitionToAttempted();
            App.notify('The user profile was updated successfully.', App.SUCCESS);
          });
        }).fail(function (xhr) {
          controller.set('isPending', false);
          App.xhrError(xhr, 'An error occurred while attempting to update the user profile.');
        });

        /*
        var nextRoute = controller.get('redirectOnSave');
        var updateStatus = function(message, isSuccess) {
          return function(model, controller, route, error_args) {
            if (isSuccess && (nextRoute != '')) {
              route.controllerFor(nextRoute).showNotification(message);
            } else {
              if (!isSuccess) {
                var error = error_args[0].error;
                if (typeof(error) != 'undefined') {
                  message = message + ' ' + controller.errorString(error);
                }
              }
              controller.showNotification(message);
            }
            model.reload();
            controller.reset_form();
            if (isSuccess) {
              controller.set('getEmail', true);
              controller.set('getMailServer', false);
            }
          }
        };
        if (model.get('isDirty')) {
          var handlers = {
            'didUpdate': {postFun:updateStatus('Profile saved successfully.', true)},
            'becameError': {postFun:updateStatus('Failed to save profile.', false), resetState: true},
          };
          if (nextRoute != '') {
            handlers['didUpdate'].nextRoute = nextRoute;
          }
          controller.setDisable(true);
          App.modelhelper.doTransaction(model, controller, route, handlers);
        } else {
          controller.showNotification('');
          controller.reset_form();
        }
        */
      }
    } else {
      return false;
    }
    return true;
  },
  sendTestEmail: function (route) {
    var controller = this;
    if (controller.getMailServer) {
      var updateNotification = function (msg) {
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
  resetProfile: function (route) {
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
  cancel: function () {
    this.transitionToRoute('login');
  }
});
