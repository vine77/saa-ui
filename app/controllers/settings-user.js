import Ember from 'ember';
import Health from '../utils/mappings/health';

export default Ember.ObjectController.extend({
  isActionPending: false,
  actions: {
    save: function() {
      var self = this;
      var user = this.get('model');
      if (!this.get('oldPassword')) {
        App.event('Please enter all of the required fields.');
      } else if (this.get('newPassword1') != this.get('newPassword2')) {
        App.event('Passwords do not match. Please try again.');
        this.set('newPassword1', '');
        this.set('newPassword2', '');
        $('#profile-newPassword1').focus();
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
          App.notify('The user profile was updated successfully.', Health.SUCCESS);
          self.set('oldPassword', '');
          self.set('newPassword1', '');
          self.set('newPassword2', '');
          $('#profile-email').focus();
        }, function(xhr) {
          self.set('isActionPending', false);
          App.xhrError(xhr, 'An error occurred while attempting to update the user profile.');
          self.set('oldPassword', '');
          self.set('newPassword1', '');
          self.set('newPassword2', '');
          $('#profile-email').focus();
        });
      }
    },
    cancel: function() {
      this.get('model').rollback();
      $('#profile-email').focus();
    }
  }
});
