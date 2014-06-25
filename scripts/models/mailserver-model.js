App.MailserverAdapter = DS.ActiveModelAdapter.extend({
  host: App.getApiDomain(),
  namespace: 'api/v2',
  buildURL: function(type, id) {
    return this._super(type, id) + '.json';
  }
});

App.Mailserver = DS.Model.extend({
  hostname: DS.attr('string'),
  port: DS.attr('string'),
  username: DS.attr('string'),
  password: DS.attr('string'),
  sender_email: DS.attr('string'),
  request: DS.attr('string')
});
