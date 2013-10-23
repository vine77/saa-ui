App.TrustNode = DS.Model.extend({
  addonConnectionString: DS.attr('string'),
  aikCertificate: DS.attr('string'),
  biosName: DS.attr('string'),
  biosOem: DS.attr('string'),
  biosVersion: DS.attr('string'),
  description: DS.attr('string'),
  email: DS.attr('string'),
  hostname: DS.attr('string'),
  ipaddress: DS.attr('string'),
  location: DS.attr('string'),
  pcrLogs: DS.attr(),
  port: DS.attr('number'),
  vmmName: DS.attr('string'),
  vmmOsname: DS.attr('string'),
  vmmOsversion: DS.attr('string'),
  vmmVersion: DS.attr('string'),

  // Full Relationships
  node: DS.belongsTo('node', {async: true}),
  trustMles: DS.hasMany('trustMle', {async: true})
});
