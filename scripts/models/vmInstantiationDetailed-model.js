App.VmInstantiationDetailedSerializer = DS.ActiveModelSerializer.extend({
  extractSingle: function(store, primaryType, payload, recordId, requestType) {
    var json = JSON.parse(JSON.stringify(payload));
    var instantiation_nodes = [], instantiation_slos = [], instantiation_node_ids = [];

    json.vm_instantiation_detailed.instantiation_nodes.forEach( function (instantiation_node, index, enumerable) {
      instantiation_node.id = instantiation_node.node_id.toString();
      instantiation_node_ids.push(instantiation_node.id);
      instantiation_node.vm_instantiation_detailed_id = json.vm_instantiation_detailed.toString();
      var instantiation_slo_ids = [];

      instantiation_node.instantiation_slos.forEach( function (instantiation_slo, index, enumerable) {
        instantiation_slo.id = instantiation_slo.slo_id.toString();
        instantiation_slo.instantiation_node_id = instantiation_node.id;
        instantiation_slo_ids.push(instantiation_slo.id);
        if (instantiation_slo.id) { instantiation_slos[instantiation_slo.id] = instantiation_slo; }
      });
      instantiation_node.instantiation_slo_ids = instantiation_slo_ids;
      instantiation_nodes.push(instantiation_node);
    });

    json.vm_instantiation_detailed.instantiation_node_ids = instantiation_node_ids;
    json.instantiation_nodes = instantiation_nodes;
    json.instantiation_slos = instantiation_slos;

    var payload = json;

    return this._super(store, primaryType, payload, recordId, requestType);
  }
});

App.VmInstantiationDetailed = DS.Model.extend({
  generation_time: DS.attr('string'),
  instantiationNodes: DS.hasMany('instantiationNode'),
  nodesCount: DS.attr(),
  schedule_time: DS.attr('string'),
  vmTrustStatus: DS.attr('boolean'),

  //Full Relationships
  vm: DS.belongsTo('vm')
});


App.InstantiationNode = DS.Model.extend({
  selected: DS.attr('boolean'),
  contention: DS.attr(),
  vmInstantiationDetailed: DS.belongsTo('vmInstantiationDetailed'),
  node: DS.belongsTo('node'),
  instantiationSlos: DS.hasMany('instantiationSlo')
});

App.InstantiationSlo = DS.Model.extend({
  slo: DS.belongsTo('slo'),
  instantiationNode: DS.belongsTo('instantiationNode'),
  description: DS.attr('string'),
  value: DS.attr('string'),
  readableValue: function () {
    if (this.get('slo.sloType') === 'trusted_platform') {
      return App.trustToString(this.get('value')).capitalize();
    } else {
      return this.get('value');
    }
  }.property('value', 'slo.sloType'),
  unit: DS.attr('string'),
  passed: DS.attr('boolean')
});


/*
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
/*
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
*/


