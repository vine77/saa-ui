import DS from 'ember-data';

export default DS.Model.extend({
  selected: DS.attr('boolean'),
  contention: DS.attr(),
  vmInstantiationDetailed: DS.belongsTo('vmInstantiationDetailed'),
  node: DS.belongsTo('node'),
  instantiationSlos: DS.hasMany('vmInstantiationDetailedSlo'),
  internalFilters: DS.attr(),
  freeCores: DS.attr()
});
