App.Nova = Ember.Object.extend({
  exists: false,
  success: false,
  check: function () {
    // Check if nova.conf file exists
    return Ember.$.ajax({
      url: ((!localStorage.apiDomain) ? '' : '//' + localStorage.apiDomain) + '/api/v1/novaconfig',
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
    });
  },
  upload: function () {
    // Upload nova.conf file
    var formData = new FormData($('#novaForm')[0]);
    return Ember.$.ajax({
      type: 'PUT',
      url: ((!localStorage.apiDomain) ? '' : '//' + localStorage.apiDomain) + '/api/v1/novaconfig',
      data: formData,
      complete: function (xhr) {
        App.log(xhr.status + ' response from PUT /api/v1/novaconfig: ' + xhr.statusText);
        if (xhr.status === 200) $('#novaForm').find('.fileupload i').removeClass().addClass('icon-ok-circle');
      },
      processData: false,
      contentType: false
    });
  },
  start: function () {
    // Start SAM
    App.log('Starting ' + App.application.get('title'), App.SUCCESS, false);
    return Ember.$.ajax({
      type: 'PUT',
      url: ((!localStorage.apiDomain) ? '' : '//' + localStorage.apiDomain) + '/api/v1/start',
      complete: function (xhr, textStatus) {
        App.log(xhr.status + ' response from PUT /api/v1/sam: ' + xhr.statusText);
        $('i.loading').addClass('hide');
        switch (xhr.status) {
          case 200:
          /*
            // Started successfully
            App.event(App.application.get('title') + ' is starting...', App.SUCCESS);
            setTimeout(function () {
              // Restart app for full reload and redirect to index
              document.location.href = '/';
            }, 30000);
          */
            break;
          default:
            // Start sam error
            App.openrc.set('exists', false);
            App.openrc.set('success', false);
            App.nova.set('exists', false);
            App.nova.set('success', false);
            App.quantum.set('exists', false);
            App.quantum.set('success', false);
            $('#novaForm .fileupload').fileupload('clear');
            $('#openrcForm .fileupload').fileupload('clear');
            $('#quantumForm .fileupload').fileupload('clear');
            /*
            var errorMessage = '';
            try {
              errorMessage = App.errorMessage(JSON.parse(xhr.responseText));
            } catch(error) {
              errorMessage = 'Error starting application.';
            }
            if (xhr.status == 500 || !errorMessage) errorMessage = 'Error starting application.';
            var title = (xhr.status != 500) ? 'Validation Error' : 'Error';
            App.event(errorMessage, App.ERROR, true, title);
            */
        }
      }
    });
  }
});

App.nova = App.Nova.create();
