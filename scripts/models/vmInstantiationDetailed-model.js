// Embedded records
DS.RESTAdapter.map('App.VmInstantiationDetailed', {
  nodesCount: {embedded: 'always'},
  instantiation_nodes: {embedded: 'always'}
});
DS.RESTAdapter.map('App.VmInstantiationDetailedInstantiationNode', {
  instantiation_slos: {embedded: 'always'},
  contention: {embedded: 'always'}
});
DS.RESTAdapter.map('App.VmInstantiationDetailedInstantiationNodeContention', {
  system: {embedded: 'always'},
  sockets: {embedded: 'always'}
});
DS.RESTAdapter.map('App.VmInstantiationDetailedInstantiationNodeContentionSystem', {
  llc: {embedded:'always'}
});
DS.RESTAdapter.map('App.VmInstantiationDetailedInstantiationNodeContentionSocket', {
  llc: {embedded: 'always'}
});


App.VmInstantiationDetailedInstantiationNodeInstantiationSlo = DS.Model.extend({
  slo: DS.belongsTo('App.Slo'),
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
  llc: DS.belongsTo('App.VmInstantiationDetailedInstantiationNodeContentionSocketLlc'),
  socket_number: DS.attr('number')
});

App.VmInstantiationDetailedInstantiationNodeContentionSystem = DS.Model.extend({
  llc: DS.belongsTo('App.VmInstantiationDetailedInstantiationNodeContentionSystemLlc')
});

App.VmInstantiationDetailedInstantiationNodeContention = DS.Model.extend({
  system: DS.belongsTo('App.VmInstantiationDetailedInstantiationNodeContentionSystem'),
  sockets: DS.hasMany('App.VmInstantiationDetailedInstantiationNodeContentionSocket'),
  socketsValues: function() {
    var returnArray = [];
    this.get('sockets').forEach( function(item, index, enumerable) {
      returnArray.push('Socket #:'+item.get('socket_number')+' Contention:'+item.get('llc.label')+'('+item.get('llc.value')+')');
    });
    return returnArray.join();
  }.property('sockets.@each')
});

App.VmInstantiationDetailedInstantiationNode = DS.Model.extend({
  node: DS.belongsTo('App.Node'),
  selected: DS.attr('string'),
  instantiation_slos: DS.hasMany('App.VmInstantiationDetailedInstantiationNodeInstantiationSlo'),
  contention: DS.belongsTo('App.VmInstantiationDetailedInstantiationNodeContention')
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
  nodesCount: DS.belongsTo('App.VmInstantiationDetailedNodesCount'),
  instantiation_nodes: DS.hasMany('App.VmInstantiationDetailedInstantiationNode'),

  //Full Relationships
  vm: DS.belongsTo('App.Vm')
});
