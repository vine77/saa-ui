App.BuildAdapter = DS.RESTSingletonAdapter.extend();

App.Build = DS.Model.extend({
  version: DS.attr('string'),
  date: DS.attr('string'),
  hostname: DS.attr('string'),
  is_master: DS.attr('boolean'),
  is_readycloud: DS.attr('boolean')
});
