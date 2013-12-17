App.Action = DS.Model.extend({
  blocking: DS.attr('boolean'),
  done: DS.attr('boolean'),
  lastUpdate: DS.attr('string'),
  message: DS.attr('string'),
  name: DS.attr('string'),
  options: DS.attr(),
  started: DS.attr('string'),
  status: DS.attr('number'),
  user: DS.attr('string'),

  // Relationships
  node: DS.belongsTo('node'),
  vm: DS.belongsTo('vm')
});
