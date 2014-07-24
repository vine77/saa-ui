import Ember from 'ember';
import Health from '../utils/mappings/health';
import log from '../utils/log';
import getApiDomain from '../utils/get-api-domain';
import application from '../models/application';

// TODO: Port this to a real model or controller
export default Ember.Object.extend({
  exists: false,
  success: false,
  check: function() {
    var self = this;
    // Check if nova.conf file exists
    return Ember.$.ajax({
      url: (getApiDomain()) + '/api/v2/configs',
      type: 'GET',
      dataType: "json",
      complete: function(xhr) {
        switch (xhr.status) {
          case 200:
            var exists = xhr.responseJSON.configs.findBy('id', 'novaFile') && xhr.responseJSON.configs.findBy('id', 'novaFile').exists;
            self.set('exists', exists);
            break;
          default:
            self.set('exists', false);
        }
      }
    });
  },
  upload: function() {
    // Upload nova.conf file
    var formData = new FormData(Ember.$('#novaForm')[0]);
    return Ember.$.ajax({
      type: 'PUT',
      url: (getApiDomain()) + '/api/v2/configs',
      data: formData,
      complete: function(xhr) {
        if (xhr.status === 200) Ember.$('#novaForm').find('.fileupload i').removeClass().addClass('icon-ok-circle');
      },
      processData: false,
      contentType: false
    });
  },
  start: function() {
    // Start SAA
    log('Starting ' + application.get('title'), Health.SUCCESS, false);
    return Ember.$.ajax({
      type: 'PUT',
      url: (getApiDomain()) + '/api/v2/start',
      complete: function(xhr, textStatus) {
        log(xhr.status + ' response from PUT /api/v2/start: ' + xhr.statusText);
      }
    });
  }
}).create();
