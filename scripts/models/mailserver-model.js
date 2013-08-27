App.Store.registerAdapter('App.Mailserver', DS.RESTAdapter);

App.Mailserver = DS.Model.extend({
  hostname: DS.attr('string'),
  port: DS.attr('string'),
  username: DS.attr('string'),
  password: DS.attr('string'),
  sender_email: DS.attr('string'),
  test_config: DS.attr('boolean')
  });
