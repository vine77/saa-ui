import ApplicationSerializer from 'application';

export default ApplicationSerializer.extend({
  extractSingle: function(store, primaryType, payload, recordId, requestType) {
    var payload = JSON.parse(JSON.stringify(payload)),
        slo_gates = payload.vm_instantiation_simple.slo_gates,
        slo_gate_ids = slo_gates.mapProperty('slo_id'),
        ranked_nodes = payload.vm_instantiation_simple.ranked_nodes,
        ranked_node_ids = ranked_nodes.mapProperty('node_id');

    payload.slo_gates = slo_gates;
    payload.vm_instantiation_simple.slo_gate_ids = slo_gate_ids;

    payload.slo_gates.map ( function(item, index, enumerable) {
      item.id = item.slo_id;
      item.vm_instantiation_simple_id = this.toString();
    }, payload.vm_instantiation_simple.id);

    payload.ranked_nodes = ranked_nodes;
    payload.vm_instantiation_simple.ranked_node_ids = ranked_node_ids;

    payload.ranked_nodes.map ( function(item, index, enumerable) {
      item.id = item.node_id;
      item.vm_instantiation_simple_id = this.id.toString();
    }, payload.vm_instantiation_simple);

    return this._super(store, primaryType, payload, recordId, requestType);
  }
});
