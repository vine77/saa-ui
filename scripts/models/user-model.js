App.User = DS.Model.extend({
  username: DS.attr('string'),
  oldPassword: DS.attr('string'),
  newPassword: DS.attr('string'),
  email: DS.attr('string'),
  resetPassword: DS.attr('boolean')
});
