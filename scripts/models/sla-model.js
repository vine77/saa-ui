App.SlaAdapter = App.ApplicationAdapter.extend({
  namespace: 'api/v1/configuration'
});

App.Sla = DS.Model.extend({
  name: DS.attr('string'),

  // Full Relationships
  slos: DS.hasMany('slo'),
  flavor: DS.belongsTo('flavor')
});
