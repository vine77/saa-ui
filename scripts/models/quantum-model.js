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
    return Ember.$.ajax({
      type: 'PUT',
      url: ((!localStorage.apiDomain) ? '' : '//' + localStorage.apiDomain) + '/api/v1/quantumconfig',
      data: formData,
      complete: function (xhr) {
        App.log(xhr.status + ' response from PUT /api/v1/quantumconfig: ' + xhr.statusText);
        if (xhr.status === 200) $('#quantumForm').find('.fileupload i').removeClass().addClass('icon-ok-circle');

      },
      processData: false,
      contentType: false
    });
  }
});

App.quantum = App.Quantum.create();
