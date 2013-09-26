App.TrustNode = DS.Model.extend({
  //Full Relationships
  node: DS.belongsTo('node'),
  trustMle: DS.hasMany('trustMle', {async: true}),

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
  // TODO: Reevaluate this hook
  becameError: function() {
    this.get('stateManager').transitionTo('rootState.loaded.saved');
  }
});
