App.Openrc = Ember.Object.extend({
  exists: false,
  success: false,
  check: function () {
    // Check if openrc file exists
    return Ember.$.ajax({
      url: ((!localStorage.apiDomain) ? '' : '//' + localStorage.apiDomain) + '/api/v1/openrcconfig',
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
    return Ember.$.ajax({
      type: 'PUT',
      url: ((!localStorage.apiDomain) ? '' : '//' + localStorage.apiDomain) + '/api/v1/openrcconfig',
      data: formData,
      complete: function (xhr) {
        App.log(xhr.status + ' response from PUT /api/v1/openrcconfig: ' + xhr.statusText);
        if (xhr.status === 200) $('#openrcForm').find('.fileupload i').removeClass().addClass('icon-ok-circle');
      },
      processData: false,
      contentType: false
    });
  }
});

App.openrc = App.Openrc.create();
