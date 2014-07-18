import DS from 'ember-data';

// TODO: Check that embedded models are referenced correctly
export default DS.Model.extend({
  generation_time: DS.attr('string'),
  instantiationNodes: DS.hasMany('vmInstantiationDetailedNode'),
  nodesCount: DS.attr(),
  schedule_time: DS.attr('string'),
  vmTrustStatus: DS.attr('boolean'),

  // Full Relationships
  vm: DS.belongsTo('vm')
});
