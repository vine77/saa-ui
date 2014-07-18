import DS from 'ember-data';

export default DS.Model.extend({
  node: DS.belongsTo('node'),
  selected: DS.attr('boolean'),
  vmInstantiationSimple: DS.belongsTo('vmInstantiationSimple')
});
