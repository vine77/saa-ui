App.Quantum = Ember.Object.extend({
  exists: false,
  success: false,
  check: function () {
    // Check if quantum file exists
    return Ember.$.ajax({
      url: (App.getApiDomain()) + '/api/v1/configs',
      type: 'GET',
      dataType: "json",
      complete: function (xhr) {
        switch (xhr.status) {
          case 200:
            var exists = xhr.responseJSON.configs.findBy('id', 'quantumFile') && xhr.responseJSON.configs.findBy('id', 'quantumFile').exists;
            App.quantum.set('exists', exists);
            break;
          default:
            App.quantum.set('exists', false);
        }
      }
    });
  },
  upload: function () {
    // Upload quantum file
    var formData = new FormData($('#quantumForm')[0]);
    return Ember.$.ajax({
      type: 'PUT',
      url: (App.getApiDomain()) + '/api/v1/configs',
      data: formData,
      complete: function (xhr) {
        if (xhr.status === 200) $('#quantumForm').find('.fileupload i').removeClass().addClass('icon-ok-circle');
      },
      processData: false,
      contentType: false
    });
  }
});

App.quantum = App.Quantum.create();
