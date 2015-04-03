App.Cgroup = DS.Model.extend({
  status: DS.attr(),
  contention: DS.attr(),
  utilization: DS.attr(),
  capabilities: DS.attr(),
  nodeName: DS.attr('string'),
  type: DS.attr('string'),

  // Computed properties
  scuTotal: function() {
    return this.get('utilization.scu.compute') + this.get('utilization.scu.io_wait') + this.get('utilization.scu.misc');
  }.property('utilization.scu.compute', 'utilization.scu.io_wait', 'utilization.scu.misc'),

  // Relationships
  node: DS.belongsTo('node')

});
