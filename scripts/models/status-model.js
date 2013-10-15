App.StatusAdapter = DS.RESTSingletonAdapter.extend();

App.Status = DS.Model.extend({
  health: DS.attr('number'),
  version: DS.attr('string'),
  master: DS.attr('boolean'),
  messages: DS.attr()
});
