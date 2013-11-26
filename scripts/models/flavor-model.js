App.FlavorAdapter = DS.RESTConfigAdapter.extend();

App.Flavor = DS.Model.extend({
  deleted: DS.attr('boolean'),
  ephemeral: DS.attr('number'),
  memory: DS.attr('number'),
  name: DS.attr('string'),
  public: DS.attr('boolean'),
  root: DS.attr('number'),
  rxtxFactor: DS.attr('number'),
  swap: DS.attr('number'),
  vcpus: DS.attr('number'),

  // Relationships
  vms: DS.hasMany('vm', {async: true}),
  sla: DS.belongsTo('sla')
  //sourceFlavor: DS.belongsTo('flavor')
});
