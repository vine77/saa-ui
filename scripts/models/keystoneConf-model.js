App.KeystoneConf = Ember.Object.extend({
  exists: false,
  success: false,
  check: function () {
    // Check if conf file exists
    return Ember.$.ajax({
      url: (App.getApiDomain()) + '/api/v2/configs',
      type: 'GET',
      dataType: "json",
      complete: function (xhr) {
        switch (xhr.status) {
          case 200:
            var exists = xhr.responseJSON.configs.findBy('id', 'KeystoneConfFile') && xhr.responseJSON.configs.findBy('id', 'KeystoneConfFile').exists;
            App.keystoneConf.set('exists', exists);
            break;
          default:
            App.keystoneConf.set('exists', false);
        }
      }
    });
  },
  upload: function () {
    // Upload keystone.conf file
    var formData = new FormData($('#keystoneConfForm')[0]);
    return Ember.$.ajax({
      type: 'PUT',
      url: (App.getApiDomain()) + '/api/v2/configs',
      data: formData,
      complete: function (xhr) {
        if (xhr.status === 200) $('#keystoneConfForm').find('.fileupload i').removeClass().addClass('icon-ok-circle');
      },
      processData: false,
      contentType: false
    });
  },
  start: function () {
    // Start SAA
    App.log('Starting ' + App.application.get('title'), App.SUCCESS, false);
    return Ember.$.ajax({
      type: 'PUT',
      url: (App.getApiDomain()) + '/api/v2/start',
      complete: function (xhr, textStatus) {
        App.log(xhr.status + ' response from PUT /api/v2/start: ' + xhr.statusText);
      }
    });
  }
});

App.keystoneConf = App.KeystoneConf.create();
