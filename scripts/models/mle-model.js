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

  //Full Relationships
  trustNode: DS.hasMany('App.TrustNode')
});

