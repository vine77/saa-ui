App.Store.registerAdapter('App.TrustNode', DS.JsonApiAdapter);

DS.RESTAdapter.map('App.TrustNode', {
  pcrLogs:  {embedded: 'always'}
});

DS.RESTAdapter.map('App.TrustNodePcrLog', {
  modulelogs:  {embedded: 'always'}
});

App.TrustNode = DS.Model.extend({
  //Full Relationships
  node: DS.belongsTo('App.Node'),
  trustMle: DS.hasMany('App.TrustMle'),

  addonConnectionString: DS.attr('string'),
  vmmName: DS.attr('string'),
  description: DS.attr('string'),
  biosName: DS.attr('string'),
  hostname: DS.attr('string'),
  aikCertificate: DS.attr('string'),
  vmmVersion: DS.attr('string'),
  biosOem: DS.attr('string'),
  vmmOsname: DS.attr('string'),
  vmmOsversion: DS.attr('string'),
  biosVersion: DS.attr('string'),
  ipaddress: DS.attr('string'),
  port: DS.attr('number'),
  email: DS.attr('string'),
  location: DS.attr('string'),
  becameError: function () {
    this.get('stateManager').transitionTo('rootState.loaded.saved');
  },

  //Embedded relationships ...
  pcrLogs: DS.hasMany('App.TrustNodePcrLog')

});

App.TrustNodePcrLog = DS.Model.extend({
  //Embedded
  modulelogs: DS.hasMany('App.TrustNodePcrLogModuleLog'),

  name: DS.attr('string'),
  value: DS.attr('string'),
  truststatus: DS.attr('boolean'),
  whitelistvalue: DS.attr('string'),
  verified_on: DS.attr('boolean')
});

App.TrustNodePcrLogModuleLog = DS.Model.extend({
  componentname: DS.attr('string'),
  whitelistvalue: DS.attr('string'),
  value: DS.attr('string'),
  truststatus: DS.attr('boolean')
});