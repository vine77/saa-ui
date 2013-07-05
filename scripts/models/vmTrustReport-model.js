DS.RESTAdapter.map('App.VmTrustReport', {
  attestations: {embedded: 'always'}
});

DS.RESTAdapter.map('App.VmAttestation', {
  node: {embedded: 'always'}
});

App.VmAttestationNode = DS.Model.extend({
  node_id: DS.attr('string'),
  node_name: DS.attr('string'),
  ip_address: DS.attr('string'),
  attestation_time: DS.attr('string'),
  attestation_time_formatted: function () {
    return moment(this.get('attestation_time')).format('LLL');
  }.property('attestation_time'),
  trust_status: DS.attr('boolean'),
  trust_message: DS.attr('string'),
  report_message: function() {
    return ((this.get('trust_status'))?'VM was started on node '+this.get('node_name')+' ('+this.get('ip_address')+') that was attested as trusted. ':'VM was started on node that failed to be found attested as trusted.')
  }.property('trust_message', 'trust_status')
});

App.VmAttestation = DS.Model.extend({
  vm_start:DS.attr('date'),
  node: DS.belongsTo('App.VmAttestationNode')
});

App.VmTrustReport = DS.Model.extend({
  generationTime: DS.attr('date'),
  vmName: DS.attr('string'),
  node: DS.belongsTo('App.Node'),
  vm: DS.belongsTo('App.Vm'),
  attestations: DS.hasMany('App.VmAttestation')
});
