App.Nova = Ember.Object.extend({
  exists: false,
  success: false,
  check: function () {
    // Check if nova.conf file exists
    return Ember.$.ajax({
      url: ((!localStorage.apiDomain) ? '' : '//' + localStorage.apiDomain) + '/api/v1/configs',
      type: 'GET',
      dataType: "json",
      complete: function (xhr) {
        switch (xhr.status) {
          case 200:
            var exists = xhr.responseJSON.configs.findBy('id', 'novaFile') && xhr.responseJSON.configs.findBy('id', 'novaFile').exists;
            App.nova.set('exists', exists);
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
      url: ((!localStorage.apiDomain) ? '' : '//' + localStorage.apiDomain) + '/api/v1/configs',
      data: formData,
      complete: function (xhr) {
        if (xhr.status === 200) $('#novaForm').find('.fileupload i').removeClass().addClass('icon-ok-circle');
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
      url: ((!localStorage.apiDomain) ? '' : '//' + localStorage.apiDomain) + '/api/v1/start',
      complete: function (xhr, textStatus) {
        App.log(xhr.status + ' response from PUT /api/v1/start: ' + xhr.statusText);
      }
    });
  }
});

App.nova = App.Nova.create();
