App.SettingsNetworkView = Ember.View.extend({
  /*didInsertElement: function () {
    var updateDisabledFields = function () {
      var isDhcpEnabled = $(this).is(':checked');
      if (isDhcpEnabled) {
        $(this).closest('section').find('.address, .netmask').attr('disabled', 'disabled');
      } else {
        $(this).closest('section').find('.address, .netmask').removeAttr('disabled');
      }
    };
    
    $('.dhcp').on('change', updateDisabledFields);
    $('.dhcp').each(updateDisabledFields);

  } */
});
