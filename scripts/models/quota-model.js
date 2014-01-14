Ember.Inflector.inflector.irregular('quota', 'quotas');

App.QuotaAdapter = DS.RESTConfigAdapter.extend();

App.Quota = DS.Model.extend({
  injectedFileContentBytes: DS.attr('number'),
  metadataItems: DS.attr('number'),
  ram: DS.attr('number'),
  floatingIps: DS.attr('number'),
  keyPairs: DS.attr('number'),
  instances: DS.attr('number'),
  securityGroupRules: DS.attr('number'),
  injectedFiles: DS.attr('number'),
  cores: DS.attr('number'),
  injectedFilePathBytes: DS.attr('number'),
  securityGroups: DS.attr('number')
});


