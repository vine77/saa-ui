App.TrustMleAdapter = DS.JsonApiAdapter.extend();

App.TrustMleSerializer = DS.ActiveModelSerializer.extend({
  attrs: {
    mleManifests: {embedded: 'always'}
  }
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
  mleManifests: DS.hasMany('trustMleManifest'),

  //Full Relationships
  trustNode: DS.hasMany('trustNode'),

  //Temporary relationship, only used for creation of mles ...
  node: DS.belongsTo('node')
});

App.TrustMleManifest = DS.Model.extend({
  name: DS.attr('string'),
  value: DS.attr('string')
});
