App.VmInstantiationSimple = DS.Model.extend({
  generationTime: DS.attr('date'),
  instantiationTrusted: function () {
    var trustFound = false;
    this.get('sloGates').forEach( function(item, index, enumerable) {
      if (item.get('slo.sloType') === "trusted_platform") {
        trustFound = true;
      }
    });
    return trustFound;
  }.property('sloGates.@each'),
  nodesCount: DS.attr(),
  rankedNodes: DS.attr(),
  scheduleTime: DS.attr('string'),
  slaName: DS.attr('string'),
  sloGates: DS.attr(),
  vmName: DS.attr('string'),
  vmTrustStatus: DS.attr('boolean'),

  //Full Relationships
  vm: DS.belongsTo('vm'),
  sla: DS.belongsTo('sla')
});



/*
// Embedded models
App.VmInstantiationSimpleNodesCount = DS.Model.extend({
  total: DS.attr('string'),
  under_sam_control: DS.attr('string')
});

App.VmInstantiationSimpleSloGate = DS.Model.extend({
  slo: DS.belongsTo('slo'),
  description: DS.attr('string'),
  nodes_count: DS.attr('string')
});

App.VmInstantiationSimpleRankedNode = DS.Model.extend({
  node: DS.belongsTo('node'),
  selected: DS.attr('boolean')
});
*/


