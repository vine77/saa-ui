App.Store.registerAdapter('App.Status', DS.RESTSingletonAdapter);

DS.RESTSingletonAdapter.map('App.Status', {
  messages: {embedded: 'always'}
});

App.Substatus = DS.Model.extend({
  message: DS.attr('string'),
  health: DS.attr('number')
});

App.Status = DS.Model.extend({
  health: DS.attr('number'),
  messages: DS.hasMany('App.Substatus')
});
