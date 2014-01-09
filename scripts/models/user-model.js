App.UserAdapter = DS.ActiveModelAdapter.extend({
  host: (!localStorage.apiDomain) ? '' : '//' + localStorage.apiDomain,
  namespace: 'api/v1',
  buildURL: function(type, id) {
    return this._super(type, id) + '.json';
  }
});

App.User = DS.Model.extend({
  username: DS.attr('string'),
  oldPassword: DS.attr('string'),
  newPassword: DS.attr('string'),
  email: DS.attr('string'),
  resetPassword: DS.attr('boolean')
});
