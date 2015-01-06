// TODO: Migrate Sunil's authentication code
App.SettingsMailserverController = Ember.ObjectController.extend(Ember.Validations.Mixin, {
  standalone: true,
  validations: {
    hostname: {
      presence: { message: 'is required - must not be blank' }
    },
    port: {
      presence: { message: 'is required - must not be blank' }
    },
    sender_email: {
      presence: { message: 'is required - must not be blank' }
    }
  },
  actions: {
    save: function () {
      var self = this;
      var mailserver = this.get('model');
      this.set('isActionPending', true);

      var self = this;
      self.validate().then(null, function() {
        var errorMessages = [];
        App.event('Form fields did not validate - please provide valid data.', App.ERROR);
        self.set('isActionPending', false);
        self.validate().then(function() {
          mailserver.save().then(function () {
            self.set('isActionPending', false);
            App.event('Successfully updated mail server settings.', App.SUCCESS);
          }, function (xhr) {
            self.set('isActionPending', false);
            App.xhrError(xhr, 'Failed to update mail server settings.');
          });
        })
      });
    },
    cancel: function () {
      this.get('model').rollback();
    },
    testEmail: function () {
      var self = this;
      var mailserver = this.get('model');
      mailserver.set('request', 'test');
      this.set('isActionPending', true);
      mailserver.save().then(function () {
        self.set('isActionPending', false);
        mailserver.set('request', '');
        App.event('Sent test email to ' + mailserver.get('sender_email') + '.', App.SUCCESS);
      }, function (xhr) {
        self.set('isActionPending', false);
        mailserver.set('request', '');
        mailserver.transitionTo('loaded.saved');
        mailserver.rollback();
        App.xhrError(xhr, 'Failed to send test email.');
      });
    }
  }
});
