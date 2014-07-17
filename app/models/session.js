App.Session = DS.Model.extend({
  username: DS.attr('string'),
  password: DS.attr('string'),
  csrfToken: DS.attr('string'),
  key: DS.attr('string'),
  tenant: DS.attr('string')
});
