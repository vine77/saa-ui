import DS from 'ember-data';

export default DS.Model.extend({
  slo: DS.belongsTo('slo'),
  vmInstantiationSimple: DS.belongsTo('vmInstantiationSimple'),
  description: DS.attr('string'),
  nodesCount: DS.attr('string')
});
