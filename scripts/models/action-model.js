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
  severity: DS.attr('number'),
  health: function() {
    if (this.get('severity')) return this.get('severity');
    return this.get('status');
  }.property('status', 'severity'),

  // Relationships
  node: DS.belongsTo('node', { async: true }),
  vm: DS.belongsTo('vm', { async: true })
});
