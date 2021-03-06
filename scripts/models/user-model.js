App.UserAdapter = DS.ActiveModelAdapter.extend({
  host: App.getApiDomain(),
  namespace: 'api/v3',
  buildURL: function(type, id) {
    return this._super(type, id) + '.json';
  }
});

App.User = DS.Model.extend({
  username: DS.attr('string'),
  oldPassword: DS.attr('string'),
  newPassword: DS.attr('string'),
  email: DS.attr('string'),
  request: DS.attr('string')
});
