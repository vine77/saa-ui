App.MailServer = Ember.Object.extend({
  hostname: '',
  port: '',
  username: '',
  password: '',
  sender_email: '',
  test: function() {
  },
  check: function () {
    hash = {
      url: '/api/v1/mailservers/default',
      type: 'GET',
      dataType: 'json',
      complete: function (xhr) {
        App.log(xhr.status + ' response from GET /api/v1/mailservers/default: ' + xhr.statusText);
      },
      success: function (data) {
        // Load mail server configuration
        App.mailserver.set('hostname', data.mailserver.hostname);
        App.mailserver.set('port', data.mailserver.port);
        App.mailserver.set('username', data.mailserver.username);
        App.mailserver.set('password', data.mailserver.password);
        App.mailserver.set('sender_email', data.mailserver.sender_email);
        App.event('Successfully loaded mail server configuration details.', App.SUCCESS, false);
      },
      error: function (xhr) {
        App.event('Mail Server configuration details could not be loaded.', App.ERROR, false);
        App.log('ERROR ' + xhr.status + ' from GET /api/v1/mailservers/default: ' + xhr.statusText);
      }
    };
    hash = $.extend(hash, App.ajaxSetup);
    return App.ajaxPromise(hash);
  },
  save: function () {
    var mailServerConfig = {
      mailserver: {
        hostname: App.mailserver.get('hostname'),
        port: App.mailserver.get('port'),
        username: App.mailserver.get('username'),
        password: App.mailserver.get('password'),
        sender_email: App.mailserver.get('sender_email'),
        test_config: App.mailserver.get('test_config')
      }
    };
    $('i.loading').removeClass('hide');
    hash = {
      url: '/api/v1/mailservers/default',
      type: 'PUT',
      data: JSON.stringify(mailServerConfig),
      dataType: 'json',
      contentType: 'application/json',
      complete: function (xhr) {
        App.log(xhr.status + ' response from POST /api/v1/mailservers/json: ' + xhr.statusText);
      },
      success: function (data) {
        $('i.loading').addClass('hide');
        if(App.mailserver.get('test_config')) {
            App.event('Test email sent to ' + mailServerConfig.mailserver.sender_email, App.SUCCESS);
        }
        else
        {
            App.event('Mail server configuration saved successfully.', App.SUCCESS);
        }
      },
      error: function (xhr) {
        $('i.loading').addClass('hide');
        if(App.mailserver.get('test_config')) {
            App.event('Failed to send test email.', App.ERROR);
        }
        else
        {
            App.event('Mail server configuration was not saved.', App.ERROR);
        }
      }
    };
    hash = $.extend(hash, App.ajaxSetup);
    $.ajax(hash);
  }
});
App.mailserver = App.MailServer.create();