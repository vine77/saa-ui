/* TODO: Update embedded models
DS.RESTAdapter.map('vmTrustReport', {
  attestations: {embedded: 'always'}
});

DS.RESTAdapter.map('vmAttestation', {
  node: {embedded: 'always'}
});
*/

App.VmTrustReportSerializer = DS.ActiveModelSerializer.extend({
  extractSingle: function(store, primaryType, payload, recordId, requestType) {
    var json = JSON.parse(JSON.stringify(payload)),
        vm_attestations = json.vm_trust_report.attestations,
        vm_attestation_ids = vm_attestations.mapProperty('vm_start');

    json.vm_attestations = vm_attestations;
    json.vm_trust_report.vm_attestation_ids = vm_attestation_ids;

    json.vm_attestations.map( function (item, index, enumerable) {
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

App.VmAttestationNode = DS.Model.extend({
  node: DS.belongsTo('node'),
  vmAttestation: DS.belongsTo('vmAttestation'),
  nodeName: DS.attr('string'),
  ipAddress: DS.attr('string'),
  attestationTime: DS.attr('string'),
  attestationTimeFormatted: function () {
    return moment(this.get('attestationTime')).format('LLL');
  }.property('attestationTime'),
  trustStatus: DS.attr('boolean'),
  trustDetails: DS.attr(),
  trustMessage: function () {
    return 'BIOS: '+this.get('trustDetails.bios')+' VMM: '+this.get('trustDetails.vmm');
  }.property('trustDetails'),
  reportMessage: function() {
    return ((this.get('trustStatus'))?'VM was started on node '+this.get('nodeName')+' ('+this.get('ipAddress')+') that was attested as trusted. ':'VM was started on node that failed to be found attested as trusted.');
  }.property('trustMessage', 'trustStatus')
});

App.VmAttestation = DS.Model.extend({
  vmStart:DS.attr('date'),
  vmAttestationNode: DS.belongsTo('vmAttestationNode'),
  vmTrustReport: DS.belongsTo('vmTrustReport')
});

App.VmTrustReport = DS.Model.extend({
  generationTime: DS.attr('date'),
  vmName: DS.attr('string'),
  vm: DS.belongsTo('vm'),
  vmAttestations: DS.hasMany('vmAttestation')
});
