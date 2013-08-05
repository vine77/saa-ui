App.SettingsMailserverController = Ember.Controller.extend({
  save: function () {
    App.mailserver.set('test_config', false);
    App.mailserver.save();
  },
  cancel: function () {
    App.mailserver.check();
  },
  test_email: function() {
    App.mailserver.set('test_config', true);
    App.mailserver.save()
  }
});
