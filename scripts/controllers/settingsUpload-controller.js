App.SettingsUploadController = Ember.ArrayController.extend({
  novaExistsBinding: 'App.nova.exists',
  novaSuccessBinding: 'App.nova.success',
  openrcExistsBinding: 'App.openrc.exists',
  openrcSuccessBinding: 'App.openrc.success',
  quantumExistsBinding: 'App.quantum.exists',
  quantumSuccessBinding: 'App.quantum.success',
  uploadNova: function () {
    App.nova.upload();
  },
  uploadOpenrc: function () {
    App.openrc.upload();
  },
  uploadQuantum: function () {
    App.quantum.upload();
  },
  updateOverrides: function () {
    App.overrides.update();
  }
});
