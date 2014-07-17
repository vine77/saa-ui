App.NodeTrustReport = DS.Model.extend({
  generationaTime: DS.attr('date'),
  attestations: DS.hasMany('attestation')
});
