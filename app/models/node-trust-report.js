import DS from 'ember-data';

export default DS.Model.extend({
  generationaTime: DS.attr('date'),
  attestations: DS.hasMany('attestation')
});
