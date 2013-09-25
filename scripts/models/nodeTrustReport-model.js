/* TODO: Update embedded models
DS.RESTAdapter.map('nodeTrustReport', {
  attestations: {embedded: 'always'}
});
*/

App.NodeTrustReportAttestation = DS.Model.extend({
  attestation_time: DS.attr('date'),
  attestation_time_formatted: function () {
    return moment(this.get('attestation_time')).format('LLL');
  }.property('attestation_time'),
  trust_status: DS.attr('boolean'),
  trust_message: DS.attr('string'),
  report_message: function() {
    return ((this.get('trust_status'))?'The node was booted and was found attested as trusted.':'The node was booted and failed to be found attested as trusted.') +
           '('+this.get('trust_message')+')';
  }.property('trust_message', 'trust_status')
});

App.NodeTrustReport = DS.Model.extend({
  generation_time: DS.attr('date'),
  attestations: DS.hasMany('nodeTrustReportAttestation')
});
