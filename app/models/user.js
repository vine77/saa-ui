import DS from 'ember-data';

export default DS.Model.extend({
  username: DS.attr('string'),
  oldPassword: DS.attr('string'),
  newPassword: DS.attr('string'),
  email: DS.attr('string'),
  request: DS.attr('string')
});
