App.NodeTrustReportSerializer = App.ApplicationSerializer.extend({
  extractSingle: function(store, primaryType, payload, recordId, requestType) {
    var json = JSON.parse(JSON.stringify(payload)),
        attestations = json.node_trust_report.attestations,
        attestation_ids = attestations.mapProperty('attestation_time');

    json.attestations = attestations;
    json.node_trust_report.attestation_ids = attestation_ids;

    json.attestations.map(function (item, index, enumerable) {
      item.id = item.attestation_time;
      item.node_trust_report_id = this.id.toString();
    }, json.node_trust_report);

    return this._super(store, primaryType, json, recordId, requestType);
  }
});
