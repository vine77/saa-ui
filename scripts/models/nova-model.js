App.Nova = Ember.Object.extend({
  exists: false,
  success: false,
  check: function () {
    // Check if nova.conf file exists
    hash = {
      url: '/api/v1/novaconfig',
      type: 'GET',
      dataType: "json",
      complete: function (xhr) {
        App.log(xhr.status + ' response from GET /api/v1/novaconfig: ' + xhr.statusText);
        switch (xhr.status) {
          case 200:
            App.nova.set('exists', true);
            break;
          default:
            App.nova.set('exists', false);
        }
      }
    };
    hash = $.extend(hash, App.ajaxSetup);
    return App.ajaxPromise(hash);
  },
  upload: function () {
    // Upload nova.conf file
    var formData = new FormData($('#novaForm')[0]);
    $('#novaForm i.loading').removeClass('hide');
    hash = {
      type: 'PUT',
      url: '/api/v1/novaconfig',
      data: formData,
      complete: function (xhr) {
        App.log(xhr.status + ' response from PUT /api/v1/novaconfig: ' + xhr.statusText);
        switch (xhr.status) {
          case 200:
            // File uploaded successfully
            $('#novaForm').find('.fileupload i').removeClass().addClass('icon-ok-circle');
            // Start SAM
            if (App.openrc.get('exists') && App.quantum.get('exists')) {
              App.nova.start();
            } else {
              App.nova.set('exists', true);
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
            // Error uploading file
            $('i.loading').addClass('hide');
          default:
            // Other errors
            $('i.loading').addClass('hide');
            App.event('Error uploading file.', App.ERROR);
        }
      },
      processData: false,
      contentType: false
    };
    hash = $.extend(hash, App.ajaxSetup);
    $.ajax(hash);
  },
  start: function () {
    // Start SAM
    App.log('Starting ' + App.application.get('title'), App.SUCCESS, false);
    jsonOptions = $.extend({
      type: 'PUT',
      url: '/api/v1/start',
      complete: function (xhr, textStatus) {
        App.log(xhr.status + ' response from PUT /api/v1/sam: ' + xhr.statusText);
        $('i.loading').addClass('hide');
        switch (xhr.status) {
          case 200:
            // Started successfully
            App.event(App.application.get('title') + ' is starting...', App.SUCCESS);
            setTimeout(function () {
              // Restart app for full reload and redirect to index
              document.location.href = '/';
            }, 30000);
            break;
          default:
            // Start sam error
            App.openrc.set('exists', false);
            App.openrc.set('success', false);
            App.nova.set('exists', false);
            App.nova.set('success', false);
            $('#novaForm .fileupload').fileupload('clear');
            $('#openrcForm .fileupload').fileupload('clear');
            var errorMessage = '';
            try {
              errorMessage = App.errorMessage(JSON.parse(xhr.responseText));
            } catch(error) {
              errorMessage = 'Error starting application.';
            }
            if (xhr.status == 500 || !errorMessage) errorMessage = 'Error starting application.';
            var title = (xhr.status != 500) ? 'Validation Error' : 'Error';
            App.event(errorMessage, App.ERROR, true, title);
        }
      }
    }, App.ajaxSetup);
    $.ajax(jsonOptions);
  }
});

App.nova = App.Nova.create();
