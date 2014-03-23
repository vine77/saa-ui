App.VmInstantiationSimpleSerializer = App.ApplicationSerializer.extend({
  extractSingle: function(store, primaryType, payload, recordId, requestType) {
    var payload = JSON.parse(JSON.stringify(payload)),
        slo_gates = payload.vm_instantiation_simple.slo_gates,
        slo_gate_ids = slo_gates.mapProperty('slo_id'),
        ranked_nodes = payload.vm_instantiation_simple.ranked_nodes,
        ranked_node_ids = ranked_nodes.mapProperty('node_id');

    payload.slo_gates = slo_gates;
    payload.vm_instantiation_simple.slo_gate_ids = slo_gate_ids;

    payload.slo_gates.map ( function (item, index, enumerable) {
      item.id = item.slo_id;
      item.vm_instantiation_simple_id = this.toString();
    }, payload.vm_instantiation_simple.id);

    payload.ranked_nodes = ranked_nodes;
    payload.vm_instantiation_simple.ranked_node_ids = ranked_node_ids;

    payload.ranked_nodes.map ( function (item, index, enumerable) {
      item.id = item.node_id;
      item.vm_instantiation_simple_id = this.id.toString();
    }, payload.vm_instantiation_simple);

    return this._super(store, primaryType, payload, recordId, requestType);
  }
});

App.SloGate = DS.Model.extend({
  slo: DS.belongsTo('slo'),
  vmInstantiationSimple: DS.belongsTo('vmInstantiationSimple'),
  description: DS.attr('string'),
  nodesCount: DS.attr('string')
});

App.RankedNode = DS.Model.extend({
  node: DS.belongsTo('node'),
  selected: DS.attr('boolean'),
  vmInstantiationSimple: DS.belongsTo('vmInstantiationSimple')
});

App.VmInstantiationSimple = DS.Model.extend({
  scheduleTime: DS.attr('string'),
  generationTime: DS.attr('string'),
  nodesCount: DS.attr(),
  rankedNodes: DS.hasMany('rankedNode'),
  scheduleTime: DS.attr('string'),
  slaName: DS.attr('string'),
  sloGates: DS.hasMany('sloGate'),
  vmName: DS.attr('string'),
  vmTrustStatus: DS.attr('boolean'),

  // Computed properties
  multipleNodes: Ember.computed.gt('nodesCount.total', 1),
  selectedNode: function () {
    if (Ember.isEmpty('rankedNodes')) return null;
    return this.get('rankedNodes').findBy('selected').get('node');
  }.property('rankedNodes'),

  // Full Relationships
  vm: DS.belongsTo('vm'),
  sla: DS.belongsTo('sla')
});



/*
// Embedded models
App.VmInstantiationSimpleNodesCount = DS.Model.extend({
  total: DS.attr('string'),
  under_saa_control: DS.attr('string')
});

App.VmInstantiationSimpleSloGate = DS.Model.extend({
  slo: DS.belongsTo('slo'),
  description: DS.attr('string'),
  nodes_count: DS.attr('string')
});

App.VmInstantiationSimpleRankedNode = DS.Model.extend({
  node: DS.belongsTo('node'),
  selected: DS.attr('boolean')
});
*/


