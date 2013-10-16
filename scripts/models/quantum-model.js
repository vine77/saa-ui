App.Quantum = Ember.Object.extend({
  exists: false,
  success: false,
  check: function () {
    // Check if quantum file exists
    return Ember.$.ajax({
      url: ((!localStorage.apiDomain) ? '' : '//' + localStorage.apiDomain) + '/api/v1/quantumconfig',
      type: 'GET',
      dataType: "json",
      complete: function (xhr) {
        App.log(xhr.status + ' response from GET /api/v1/quantumconfig: ' + xhr.statusText);
        switch (xhr.status) {
          case 200:
            App.quantum.set('exists', true);
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
    $('#quantumForm i.loading').removeClass('hide');
    return Ember.$.ajax({
      type: 'PUT',
      url: ((!localStorage.apiDomain) ? '' : '//' + localStorage.apiDomain) + '/api/v1/quantumconfig',
      data: formData,
      complete: function (xhr) {
        App.log(xhr.status + ' response from PUT /api/v1/quantumconfig: ' + xhr.statusText);
        switch (xhr.status) {
          case 200:
            // File uploaded successfully
            $('#quantumForm').find('.fileupload i').removeClass().addClass('icon-ok-circle');
            // Start SAM
            if (App.nova.get('exists') && App.openrc.get('exists')) {
              App.nova.start();
            } else {
              App.quantum.set('exists', true);
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

App.quantum = App.Quantum.create();
