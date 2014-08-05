import Ember from 'ember';
import Health from '../../utils/mappings/health';
import notify from '../../utils/notify';
import event from '../../utils/event';
import xhrError from '../../utils/xhr-error';

export default Ember.ObjectController.extend({
  isActionPending: false,
  actions: {
    save: function() {
      var self = this;
      var user = this.get('model');
      if (!this.get('oldPassword')) {
        event('Please enter all of the required fields.');
      } else if (this.get('newPassword1') !== this.get('newPassword2')) {
        event('Passwords do not match. Please try again.');
        this.set('newPassword1', '');
        this.set('newPassword2', '');
        Ember.$('#profile-newPassword1').focus();
      } else {
        user.setProperties({
          username: this.get('username'),
          oldPassword: this.get('oldPassword'),
          newPassword: this.get('newPassword1') || '',
          email: this.get('email')
        });
        this.set('isActionPending', true);
        return user.save().then(function() {
          self.set('isActionPending', false);
          notify('The user profile was updated successfully.', Health.SUCCESS);
          self.set('oldPassword', '');
          self.set('newPassword1', '');
          self.set('newPassword2', '');
          Ember.$('#profile-email').focus();
        }, function(xhr) {
          self.set('isActionPending', false);
          xhrError(xhr, 'An error occurred while attempting to update the user profile.');
          self.set('oldPassword', '');
          self.set('newPassword1', '');
          self.set('newPassword2', '');
          Ember.$('#profile-email').focus();
        });
      }
    },
    cancel: function() {
      this.get('model').rollback();
      Ember.$('#profile-email').focus();
    }
  }
});
