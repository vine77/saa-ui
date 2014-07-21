import Ember from 'ember';
import Health from '../utils/mappings/health';
import event from '../utils/event';
import xhrError from '../utils/xhr-error';

// TODO: Migrate Sunil's authentication code
export default = Ember.ObjectController.extend({
  standalone: true,
  actions: {
    save: function() {
      var self = this;
      var mailserver = this.get('model');
      this.set('isActionPending', true);
      mailserver.save().then(function() {
        self.set('isActionPending', false);
        event('Successfully updated mail server settings.', Health.SUCCESS);
      }, function(xhr) {
        self.set('isActionPending', false);
        xhrError(xhr, 'Failed to update mail server settings.');
      });
    },
    cancel: function() {
      this.get('model').rollback();
    },
    testEmail: function() {
      var self = this;
      var mailserver = this.get('model');
      mailserver.set('request', 'test');
      this.set('isActionPending', true);
      mailserver.save().then(function() {
        self.set('isActionPending', false);
        mailserver.set('request', '');
        event('Sent test email to ' + mailserver.get('sender_email') + '.', Health.SUCCESS);
      }, function(xhr) {
        self.set('isActionPending', false);
        mailserver.set('request', '');
        mailserver.transitionTo('loaded.saved');
        mailserver.rollback();
        xhrError(xhr, 'Failed to send test email.');
      });
    }
  }
});
