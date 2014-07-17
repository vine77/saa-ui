// TODO: Check that embedded models are referenced correctly
App.VmTrustReport = DS.Model.extend({
  generationTime: DS.attr('date'),
  vmName: DS.attr('string'),
  vm: DS.belongsTo('vm'),
  vmAttestations: DS.hasMany('vmTrustReportVmAttestation')
});
