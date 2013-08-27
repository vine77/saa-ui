App.Store.registerAdapter('App.Session', DS.RESTAdapter);

App.Session = DS.Model.extend({
  username: DS.attr('string'),
  password: DS.attr('string'),
  csrf_token: DS.attr('string'),
  bypass: false
});
