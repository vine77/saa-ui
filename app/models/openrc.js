import Ember from 'ember';
import getApiDomain from '../utils/get-api-domain';

// TODO: Port this to a real model or controller
export default Ember.Object.extend({
  exists: false,
  success: false,
  check: function() {
    var self = this;
    // Check if openrc file exists
    return Ember.$.ajax({
      url: (getApiDomain()) + '/api/v2/configs.json',
      type: 'GET',
      dataType: "json",
      complete: function(xhr) {
        switch (xhr.status) {
          case 200:
            var exists = xhr.responseJSON.configs.findBy('id', 'openrcFile') && xhr.responseJSON.configs.findBy('id', 'openrcFile').exists;
            self.set('exists', exists);
            break;
          default:
            self.set('exists', false);
        }
      }
    });
  },
  upload: function() {
    // Upload openrc file
    var formData = new FormData(Ember.$('#openrcForm')[0]);
    return Ember.$.ajax({
      type: 'PUT',
      url: (getApiDomain()) + '/api/v2/configs.json',
      data: formData,
      complete: function(xhr) {
        if (xhr.status === 200) Ember.$('#openrcForm').find('.fileupload i').removeClass().addClass('icon-ok-circle');
      },
      processData: false,
      contentType: false
    });
  }
}).create();
