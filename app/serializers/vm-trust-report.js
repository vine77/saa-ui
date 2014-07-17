App.VmTrustReportSerializer = App.ApplicationSerializer.extend({
  extractSingle: function(store, primaryType, payload, recordId, requestType) {
    var json = JSON.parse(JSON.stringify(payload)),
        vm_attestations = json.vm_trust_report.attestations,
        vm_attestation_ids = vm_attestations.mapProperty('vm_start');

    json.vm_attestations = vm_attestations;
    json.vm_trust_report.vm_attestation_ids = vm_attestation_ids;

    json.vm_attestations.map(function (item, index, enumerable) {
      item.id = item.vm_start;
      item.vm_trust_report_id = this.id.toString();
      item.vm_attestation_node_id = item.node.node_id;
      item.node.vm_attestation_id = item.id;
      item.node.id = item.node.node_id;
    }, json.vm_trust_report);

    json.vm_attestation_nodes = vm_attestations.mapProperty('node');

    return this._super(store, primaryType, json, recordId, requestType);
  }
});
