App.Store.registerAdapter('App.Flavor', DS.RESTConfigAdapter);

App.Flavor = DS.Model.extend({
  // Common Properties
  isActive: false,
  isSelected: false,
  isExpanded: function () {
    return this.get('isActive');
  }.property('isActive'),

  // Full Relationships
  vms: DS.hasMany('App.Vm'),
  sla: DS.belongsTo('App.Sla'),  // Available for get_one details only
  sourceFlavor: DS.belongsTo('App.Flavor'),

  // Properties from API get_all list
  name: DS.attr('string'),
  vcpus: DS.attr('number'),
  memory: DS.attr('number'),
  root: DS.attr('number'),

  // Properties from API get_one details
  rxtxFactor: DS.attr('number'),
  ephemeral: DS.attr('number'),
  public: DS.attr('number'),
  swap: DS.attr('number'),

  numberOfVms: function () {
    return this.get('vms.length');
  }.property('vms.@each')

  // Extra properties for PUT request body
  // ref_flavor = input_dto.source_flavor_id
  // flavor_name = input_dto.name
  // sla_id = input_dto.sla_id
  // TODO: Determine how Ember Data submits updates for relationships
});
