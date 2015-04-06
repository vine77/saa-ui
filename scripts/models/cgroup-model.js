App.Cgroup = DS.Model.extend({
  status: DS.attr(),
  contention: DS.attr(),
  utilization: DS.attr(),
  capabilities: DS.attr(),
  nodeName: DS.attr('string'),
  type: DS.attr('string'),

  // Computed properties
  scuTotal: function() {
    var compute = this.get('utilization.scu.compute');
    var ioWait = this.get('utilization.scu.io_wait');
    var misc = this.get('utilization.scu.misc');
    if (Ember.isEmpty(compute) && Ember.isEmpty(ioWait) && Ember.isEmpty(misc)) return null;
    if ((compute === -1) || (ioWait === -1) || (misc === -1)) return -1;
    var returnValue = (compute || 0) + (ioWait || 0) + (misc || 0);
    return returnValue.toFixed(2);
  }.property('utilization.scu.compute', 'utilization.scu.io_wait', 'utilization.scu.misc'),

  // Relationships
  // TODO: Should be async after upgrading to ED w/ SSOT
  node: DS.belongsTo('node')

});
