App.Store.registerAdapter('App.TrustMle', DS.JsonApiAdapter);

//DS.JsonApiAdapter.map('App.TrustMle', {
DS.RESTAdapter.map('App.TrustMle', {
  mleManifests:  {embedded: 'always'}
});

DS.JsonApiAdapter.map('App.TrustMle', {
  mleManifests:  {embedded: 'always'}
});

App.TrustMle = DS.Model.extend({
  isActive: false,
  isSelected: false,
  isExpanded: function () {
    return this.get('isActive');
  }.property('isActive'),

  mleType: DS.attr('string'),
  name: DS.attr('string'),
  oemname: DS.attr('string'),
  attestationType: DS.attr('string'),
  osname: DS.attr('string'),
  version: DS.attr('string'),
  osversion: DS.attr('string'),
  mleManifests: DS.attr('string'),
  description: DS.attr('string'),

  //Embedded Relationships
  mleManifests: DS.hasMany('App.TrustMleManifest'),

  //Full Relationships
  trustNode: DS.hasMany('App.TrustNode'),

  //Temporary relationship, only used for creation of mles ...
  node: DS.belongsTo('App.Node')
});

App.TrustMleManifest = DS.Model.extend({
  name: DS.attr('string'),
  value: DS.attr('string')
});
