App.Store.registerAdapter('App.User', DS.RESTAdapter);

App.User = DS.Model.extend({
  username: DS.attr('string'),
  oldPassword: DS.attr('string'),
  newPassword: DS.attr('string'),
  firstName: DS.attr('string'),
  lastName: DS.attr('string'),
  name: DS.attr('string'),
  email: DS.attr('string'),
  isEnabled: DS.attr('boolean'),
  isEditing: DS.attr('boolean'),
  resetPassword: DS.attr('boolean'),
  role: DS.attr('string'),
});

