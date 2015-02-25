App.Keystone = Ember.Object.extend({
  exists: false,
  success: false,
  check: function () {
    // Check if cacert.pem file exists
    return Ember.$.ajax({
      url: (App.getApiDomain()) + '/api/v3/configs',
      type: 'GET',
      dataType: "json",
      complete: function (xhr) {
        switch (xhr.status) {
          case 200:
            var exists = xhr.responseJSON.configs.findBy('id', 'KeystoneCaCertFile') && xhr.responseJSON.configs.findBy('id', 'KeystoneCaCertFile').exists;
            App.keystone.set('exists', exists);
            break;
          default:
            App.keystone.set('exists', false);
        }
      }
    });
  },
  upload: function () {
    // Upload cacert.pem file
    var formData = new FormData($('#keystoneForm')[0]);
    return Ember.$.ajax({
      type: 'PUT',
      url: (App.getApiDomain()) + '/api/v3/configs',
      data: formData,
      complete: function (xhr) {
        if (xhr.status === 200) $('#keystoneForm').find('.fileupload i').removeClass().addClass('icon-ok-circle');
      },
      processData: false,
      contentType: false
    });
  }
});

App.keystone = App.Keystone.create();
