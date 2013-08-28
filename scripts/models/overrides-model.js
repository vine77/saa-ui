App.Overrides = Ember.Object.extend({
  rabbitHostIp: null,
  horizonHostIp: null,
  fetch: function () {
    var ajaxOptions = $.extend({
      url: ((!localStorage.apiDomain) ? '' : '//' + localStorage.apiDomain) + '/api/v1/override',
      type: 'GET',
      dataType: 'json',
      complete: function (jqXHR, textStatus) {
        if (jqXHR.status == 200) {
          overrides = jQuery.parseJSON(jqXHR.responseText);
          App.overrides.set('rabbitHostIp', overrides.amqp_general.rabbit_host);
          App.overrides.set('horizonHostIp', overrides.horizon.horizon_host);
        }
      }
    }, App.ajaxSetup);
    $.ajax(ajaxOptions);
  },
  update: function () {
    $('#overridesLoading').removeClass('hide');
    var dataJson = {
      amqp_general: {
        rabbit_host: App.overrides.get('rabbitHostIp')
      },
      horizon: {
        horizon_host: App.overrides.get('horizonHostIp')
      }
    };

    var ajaxOptions = $.extend({
      url: ((!localStorage.apiDomain) ? '' : '//' + localStorage.apiDomain) + '/api/v1/override',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(dataJson),
      dataType: 'json',
      complete: function (jqXHR, textStatus) {
        $('#overridesLoading').addClass('hide'); 
        if (jqXHR.status == 200) {
          App.event('Successfully updated configuration overrides.', App.SUCCESS);
        } else if (jqXHR.status == 422) {
            var responseMessage = jQuery.parseJSON(jqXHR.responseText);
            App.event(responseMessage.error_message, App.ERROR);
        } else {
          App.event('Error updating configuration overrides.', App.ERROR);
        }
      }
    }, App.ajaxSetup);
    $.ajax(ajaxOptions);
  }

});

App.overrides = App.Overrides.create();
