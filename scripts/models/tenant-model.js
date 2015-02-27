App.Tenant = DS.Model.extend({
  name: DS.attr('string'),
  enabled: DS.attr('boolean'),

  // Relationships
  nodes: DS.hasMany('node', { async: true }),
  vms: DS.hasMany('vm', { async: true })
});
