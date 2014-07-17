App.InstantiationNode = DS.Model.extend({
  selected: DS.attr('boolean'),
  contention: DS.attr(),
  vmInstantiationDetailed: DS.belongsTo('vmInstantiationDetailed'),
  node: DS.belongsTo('node'),
  instantiationSlos: DS.hasMany('vmInstantiationDetailedSlo'),
  internalFilters: DS.attr()
});
