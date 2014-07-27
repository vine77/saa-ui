import DS from 'ember-data';
import trustToString from '../utils/convert/trust-to-string';

export default DS.Model.extend({
  nodeTrustReport: DS.belongsTo('nodeTrustReport'),
  attestation_time: DS.attr('date'),
  attestation_time_formatted: function() {
    return window.moment(this.get('attestation_time')).format('LLL');
  }.property('attestation_time'),
  trust_status: DS.attr('number'),
  trust_details: DS.attr(),
  trust_message: function() {
    return 'BIOS: ' + trustToString(this.get('trust_details.bios')).capitalize() + ', VMM: ' + trustToString(this.get('trust_details.vmm')).capitalize();
  }.property('trust_details'),
  report_message: function() {
    return 'Node attestation: ' + trustToString(this.get('trust_status')).capitalize() + ' (' + this.get('trust_message') + ')';
  }.property('trust_message', 'trust_status')
});
