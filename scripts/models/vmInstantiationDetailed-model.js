// Embedded records
/* TODO: Update embedded models
DS.RESTAdapter.map('vmInstantiationDetailed', {
  nodesCount: {embedded: 'always'},
  instantiation_nodes: {embedded: 'always'}
});
DS.RESTAdapter.map('vmInstantiationDetailedInstantiationNode', {
  instantiation_slos: {embedded: 'always'},
  contention: {embedded: 'always'}
});
DS.RESTAdapter.map('vmInstantiationDetailedInstantiationNodeContention', {
  system: {embedded: 'always'},
  sockets: {embedded: 'always'}
});
DS.RESTAdapter.map('vmInstantiationDetailedInstantiationNodeContentionSystem', {
  llc: {embedded:'always'}
});
DS.RESTAdapter.map('vmInstantiationDetailedInstantiationNodeContentionSocket', {
  llc: {embedded: 'always'}
});
*/

App.VmInstantiationDetailedInstantiationNodeInstantiationSlo = DS.Model.extend({
  slo: DS.belongsTo('slo'),
  description: DS.attr('string'),
  value: DS.attr('string'),
  unit: DS.attr('string'),
  passed: DS.attr('boolean')
});

App.VmInstantiationDetailedInstantiationNodeContentionSystemLlc = DS.Model.extend({
  label: DS.attr('string'),
  value: DS.attr('string')
});

App.VmInstantiationDetailedInstantiationNodeContentionSocketLlc = DS.Model.extend({
  label: DS.attr('string'),
  value: DS.attr('string')
});

App.VmInstantiationDetailedInstantiationNodeContentionSocket = DS.Model.extend({
  llc: DS.belongsTo('vmInstantiationDetailedInstantiationNodeContentionSocketLlc'),
  socket_number: DS.attr('number')
});

App.VmInstantiationDetailedInstantiationNodeContentionSystem = DS.Model.extend({
  llc: DS.belongsTo('vmInstantiationDetailedInstantiationNodeContentionSystemLlc')
});

App.VmInstantiationDetailedInstantiationNodeContention = DS.Model.extend({
  system: DS.belongsTo('vmInstantiationDetailedInstantiationNodeContentionSystem'),
  sockets: DS.hasMany('vmInstantiationDetailedInstantiationNodeContentionSocket'),
  socketsValues: function() {
    var returnArray = [];
    this.get('sockets').forEach( function(item, index, enumerable) {
      returnArray.push('Socket #:'+item.get('socket_number')+' Contention:'+item.get('llc.label')+'('+item.get('llc.value')+')');
    });
    return returnArray.join();
  }.property('sockets.@each')
});

App.VmInstantiationDetailedInstantiationNode = DS.Model.extend({
  node: DS.belongsTo('node'),
  selected: DS.attr('string'),
  instantiation_slos: DS.hasMany('vmInstantiationDetailedInstantiationNodeInstantiationSlo'),
  contention: DS.belongsTo('vmInstantiationDetailedInstantiationNodeContention')
});

App.VmInstantiationDetailedNodesCount = DS.Model.extend({
  total: DS.attr('string'),
  under_sam_control: DS.attr('string')
});

App.VmInstantiationDetailed = DS.Model.extend({
  generation_time: DS.attr('string'),
  schedule_time: DS.attr('string'),
  vmTrustStatus: DS.attr('boolean'),

  //Embedded Relationships
  nodesCount: DS.belongsTo('vmInstantiationDetailedNodesCount'),
  instantiation_nodes: DS.hasMany('vmInstantiationDetailedInstantiationNode'),

  //Full Relationships
  vm: DS.belongsTo('vm')
});
