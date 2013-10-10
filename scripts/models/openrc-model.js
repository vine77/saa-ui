App.Openrc = Ember.Object.extend({
  exists: false,
  success: false,
  check: function () {
    // Check if openrc file exists
    return Ember.$.ajax({
      url: '/api/v1/openrcconfig',
      type: 'GET',
      dataType: "json",
      complete: function (xhr) {
        App.log(xhr.status + ' response from GET /api/v1/openrcconfig: ' + xhr.statusText);
        switch (xhr.status) {
          case 200:
            App.openrc.set('exists', true);
            break;
          default:
            App.openrc.set('exists', false);
        }
      }
    });
  },
  upload: function () {
    // Upload openrc file
    var formData = new FormData($('#openrcForm')[0]);
    $('#openrcForm i.loading').removeClass('hide');
    return Ember.$.ajax({
      type: 'PUT',
      url: '/api/v1/openrcconfig',
      data: formData,
      complete: function (xhr) {
        App.log(xhr.status + ' response from PUT /api/v1/openrcconfig: ' + xhr.statusText);
        switch (xhr.status) {
          case 200:
            // File uploaded successfully
            $('#openrcForm').find('.fileupload i').removeClass().addClass('icon-ok-circle');
            // Start SAM
            if (App.nova.get('exists') && App.quantum.get('exists')) {
              App.nova.start();
            } else {
              App.openrc.set('exists', true);
              $('i.loading').addClass('hide');
              App.event('File uploaded successfully', App.SUCCESS);
            }
            break;
          case 400:
            // No file found
            $('i.loading').addClass('hide');
            App.event('Please select a file to upload.', App.WARNING);
            break;
          case 500:
          $('i.loading').addClass('hide');
            // Error uploading file
          default:
            // Other errors
            $('i.loading').addClass('hide');
            App.event('Error uploading file.', App.ERROR);
        }
      },
      processData: false,
      contentType: false
    });
  }
});

App.openrc = App.Openrc.create();
