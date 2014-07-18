import DS from 'ember-data';

export default DS.Model.extend({
  vmStart: DS.attr('date'),
  vmAttestationNode: DS.belongsTo('vmTrustReportVmAttestationNode'),
  vmTrustReport: DS.belongsTo('vmTrustReport')
});
