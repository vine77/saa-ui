App.StatusAdapter = DS.RESTSingletonAdapter.extend();

/* TODO: Update embedded models
DS.RESTSingletonAdapter.map('status', {
  messages: {embedded: 'always'}
});
*/

App.Substatus = DS.Model.extend({
  message: DS.attr('string'),
  health: DS.attr('number')
});

App.Status = DS.Model.extend({
  health: DS.attr('number'),
  messages: DS.hasMany('substatus')
});
