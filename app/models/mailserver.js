import DS from 'ember-data';

export default DS.Model.extend({
  hostname: DS.attr('string'),
  port: DS.attr('string'),
  username: DS.attr('string'),
  password: DS.attr('string'),
  sender_email: DS.attr('string'),
  request: DS.attr('string')
});
