// TODO: Migrate Sunil's authentication code
App.SettingsMailserverController = Ember.ObjectController.extend({
  standalone: true,
  actions: {
    save: function () {
      var self = this;
      var mailserver = this.get('model');
      this.set('isActionPending', true);
      mailserver.save().then(function () {
        self.set('isActionPending', false);
        App.event('Successfully updated mail server settings.', App.SUCCESS);
      }, function (xhr) {
        self.set('isActionPending', false);
        App.xhrError(xhr, 'Failed to update mail server settings.');
      });
    },
    cancel: function () {
      this.get('model').rollback();
    },
    testEmail: function () {
      var self = this;
      var mailserver = this.get('model');
      mailserver.set('test_config', true);
      this.set('isActionPending', true);
      mailserver.save().then(function () {
        self.set('isActionPending', false);
        mailserver.set('test_config', false);
        App.event('Sent test email to ' + mailserver.get('sender_email') + '.', App.SUCCESS);
      }, function (xhr) {
        self.set('isActionPending', false);
        mailserver.set('test_config', false);
        App.xhrError(xhr, 'Failed to send test email.');
      });
    }
  }
});
