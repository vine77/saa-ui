import DS from 'ember-data';

// TODO: Check that embedded models are referenced correctly
export default DS.Model.extend({
  generationTime: DS.attr('date'),
  vmName: DS.attr('string'),
  vm: DS.belongsTo('vm'),
  vmAttestations: DS.hasMany('vmTrustReportVmAttestation')
});
