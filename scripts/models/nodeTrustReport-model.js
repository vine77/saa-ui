App.NodeTrustReportSerializer = DS.ActiveModelSerializer.extend({
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

App.Attestation = DS.Model.extend({
  nodeTrustReport: DS.belongsTo('nodeTrustReport'),
  attestation_time: DS.attr('date'),
  attestation_time_formatted: function () {
    return moment(this.get('attestation_time')).format('LLL');
  }.property('attestation_time'),
  trust_status: DS.attr('number'),
  trust_details: DS.attr(),
  trust_message: function () {
    return 'BIOS: ' + App.trustToString(this.get('trust_details.bios')).capitalize() + ', VMM: ' + App.trustToString(this.get('trust_details.vmm')).capitalize();
  }.property('trust_details'),
  report_message: function() {
    return 'Node attestation: ' + App.trustToString(this.get('trust_status')).capitalize() + ' (' + this.get('trust_message') + ')';
  }.property('trust_message', 'trust_status')
});

App.NodeTrustReport = DS.Model.extend({
  generationaTime: DS.attr('date'),
  attestations: DS.hasMany('attestation')
});
