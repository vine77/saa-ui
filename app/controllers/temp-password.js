import Ember from 'ember';
import FormController from './form';
import Health from '../utils/mappings/health';
import notify from '../utils/notify';
import xhrError from '../utils/xhr-error';

export default FormController.extend({
  needs: ['login'],
  isActionPending: false,
  username: Ember.computed.alias('controllers.login.username'),
  actions: {
    generatePassword: function() {
      var self = this;
      var username = this.get('username');
      if (!username) {
        notify('Please enter your username in order to reset your password.');
      } else {
        this.set('isActionPending', true);
        return this.store.find('user', username).then(function(user) {
          user.set('request', 'reset_password');
          return user.save().then(function() {
            self.set('isActionPending', false);
            notify('Temporary password generated successfully. A temporary password was sent via email.', Health.SUCCESS);
            user.set('request', '');
            self.transitionTo('login');
          }, function(xhr) {
            self.set('isActionPending', false);
            user.set('request', '');
            xhrError(xhr, 'A password reset email was not sent due to an error. Note that temporary passwords can only be generated once every 120 mins.');
          });
        }, function(xhr) {
          self.set('isActionPending', false);
          xhrError(xhr, 'Could not find user. Please check your username and try again.');
        });
      }
    }
  }
});
