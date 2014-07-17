App.VmAttestationNode = DS.Model.extend({
  node: DS.belongsTo('node'),
  vmAttestation: DS.belongsTo('vmAttestation'),
  nodeName: DS.attr('string'),
  ipAddress: DS.attr('string'),
  attestationTime: DS.attr('string'),
  attestationTimeFormatted: function () {
    return moment(this.get('attestationTime')).format('LLL');
  }.property('attestationTime'),
  trustStatus: DS.attr('number'),
  trustDetails: DS.attr(),
  trustMessage: function () {
    return 'BIOS: ' + App.trustToString(this.get('trustDetails.bios')).capitalize() + ', VMM: ' + App.trustToString(this.get('trustDetails.vmm')).capitalize();
  }.property('trustDetails'),
  reportMessage: function() {
    return 'Node attestation: ' + App.trustToString(this.get('trustStatus')).capitalize() + ' (' + this.get('trustMessage') + ')';
  }.property('trustMessage', 'trustStatus')
});
