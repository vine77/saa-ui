App.BuildAdapter = DS.RESTSingletonAdapter.extend();

App.Build = DS.Model.extend({
  version: DS.attr('string'),
  date: DS.attr('string'),
  hostname: DS.attr('string'),
  isMaster: DS.attr('boolean'),
  isReadycloud: DS.attr('boolean')
});
