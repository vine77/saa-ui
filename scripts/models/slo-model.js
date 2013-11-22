App.SloAdapter = DS.RESTConfigAdapter.extend();

App.Slo = DS.Model.extend({
  // Properties
  description: DS.attr('string'),
  deleted: DS.attr('boolean'),
  value: DS.attr('string'),
  version: DS.attr('number'),
  operator: DS.attr('string'),

  // Alias properties inherited from associated sloTemplate
  className: Ember.computed.alias('sloTemplate.className'),
  elementName: Ember.computed.alias('sloTemplate.elementName'),
  sloType: Ember.computed.alias('sloTemplate.sloType'),
  unit: Ember.computed.alias('sloTemplate.unit'),
  valueType: Ember.computed.alias('sloTemplate.valueType'),

  // Relationships
  sla: DS.belongsTo('sla'),
  sloTemplate: DS.belongsTo('sloTemplate')
});
