import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  extractSingle: function(store, primaryType, payload, recordId, requestType) {
    var json = JSON.parse(JSON.stringify(payload));
    var instantiation_nodes = [], instantiation_slos = [], instantiation_node_ids = [];

    json.vm_instantiation_detailed.instantiation_nodes.forEach( function(instantiation_node, index, enumerable) {
      instantiation_node.id = instantiation_node.node_id.toString();
      instantiation_node_ids.push(instantiation_node.id);
      instantiation_node.vm_instantiation_detailed_id = json.vm_instantiation_detailed.toString();
      var instantiation_slo_ids = [];

      instantiation_node.instantiation_slos.forEach(function(instantiation_slo, index, enumerable) {
        instantiation_slo.id = btoa(JSON.stringify(instantiation_slo));
        instantiation_slo.instantiation_node_id = instantiation_node.id;
        instantiation_slo_ids.push(instantiation_slo.id);
        if (instantiation_slo.id) instantiation_slos.push(instantiation_slo);
      });
      instantiation_node.instantiation_slo_ids = instantiation_slo_ids;
      instantiation_nodes.push(instantiation_node);
    });

    json.vm_instantiation_detailed.instantiation_node_ids = instantiation_node_ids;
    json.instantiation_nodes = instantiation_nodes;
    json.instantiation_slos = instantiation_slos;

    return this._super(store, primaryType, json, recordId, requestType);
  }
});
