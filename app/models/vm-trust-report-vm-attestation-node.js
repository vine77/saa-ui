import DS from 'ember-data';
import trustToString from '../utils/convert/trust-to-string';

export default DS.Model.extend({
  node: DS.belongsTo('node'),
  vmAttestation: DS.belongsTo('vmAttestation'),
  nodeName: DS.attr('string'),
  ipAddress: DS.attr('string'),
  attestationTime: DS.attr('string'),
  attestationTimeFormatted: function() {
    return moment(this.get('attestationTime')).format('LLL');
  }.property('attestationTime'),
  trustStatus: DS.attr('number'),
  trustDetails: DS.attr(),
  trustMessage: function() {
    return 'BIOS: ' + trustToString(this.get('trustDetails.bios')).capitalize() + ', VMM: ' + trustToString(this.get('trustDetails.vmm')).capitalize();
  }.property('trustDetails'),
  reportMessage: function() {
    return 'Node attestation: ' + trustToString(this.get('trustStatus')).capitalize() + ' (' + this.get('trustMessage') + ')';
  }.property('trustMessage', 'trustStatus')
});
