App.FlavorAdapter = App.ApplicationAdapter.extend({
  namespace: 'api/v1/configuration'
});

App.Flavor = DS.Model.extend({
  ephemeral: DS.attr('number'),
  memory: DS.attr('number'),
  name: DS.attr('string'),
  public: DS.attr('number'),
  root: DS.attr('number'),
  rxtxFactor: DS.attr('number'),
  swap: DS.attr('number'),
  vcpus: DS.attr('number'),

  // Relationships
  vms: DS.hasMany('vm', {async: true}),
  sla: DS.belongsTo('sla'),
  sourceFlavor: DS.belongsTo('flavor')

  // Extra properties for PUT request body
  // ref_flavor = input_dto.source_flavor_id
  // flavor_name = input_dto.name
  // sla_id = input_dto.sla_id
  // TODO: Determine how Ember Data submits updates for relationships
});
