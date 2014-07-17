App.VmAttestation = DS.Model.extend({
  vmStart: DS.attr('date'),
  vmAttestationNode: DS.belongsTo('vmTrustReportVmAttestationNode'),
  vmTrustReport: DS.belongsTo('vmTrustReport')
});
