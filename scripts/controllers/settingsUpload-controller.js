App.SettingsUploadController = Ember.ArrayController.extend({
  novaExistsBinding: 'App.nova.exists',
  novaSuccessBinding: 'App.nova.success',
  openrcExistsBinding: 'App.openrc.exists',
  openrcSuccessBinding: 'App.openrc.success',
  uploadNova: function () {
    App.nova.upload();
  },
  uploadOpenrc: function () {
    App.openrc.upload();
  }
});
