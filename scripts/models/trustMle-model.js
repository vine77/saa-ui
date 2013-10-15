App.TrustMle = DS.Model.extend({
  attestationType: DS.attr('string'),
  description: DS.attr('string'),
  mleManifests: DS.attr('string'),
  mleManifests: DS.attr(),
  mleType: DS.attr('string'),
  name: DS.attr('string'),
  oemname: DS.attr('string'),
  osname: DS.attr('string'),
  osversion: DS.attr('string'),
  version: DS.attr('string'),

  // Relationships
  trustNode: DS.hasMany('trustNode', {async: true}),
  node: DS.belongsTo('node', {async: true})  // Only used in MLE creation
});
