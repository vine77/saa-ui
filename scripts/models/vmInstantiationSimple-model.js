// Embedded records

/* TODO: Update embedded models
DS.RESTAdapter.map('vmInstantiationSimple', {
  nodesCount: {embedded: 'always'},
  sloGates: {embedded: 'always'},
  rankedNodes: {embedded: 'always'}
});
*/

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

App.VmInstantiationSimple = DS.Model.extend({
  generationTime: DS.attr('date'),
  scheduleTime: DS.attr('string'),
  slaName: DS.attr('string'),
  vmName: DS.attr('string'),
  vmTrustStatus: DS.attr('boolean'),

  //Full Relationships
  vm: DS.belongsTo('vm'),
  sla: DS.belongsTo('sla'),

  //Embedded Relationships
  nodesCount: DS.belongsTo('vmInstantiationSimpleNodesCount'),
  sloGates: DS.hasMany('vmInstantiationSimpleSloGate'),
  rankedNodes: DS.hasMany('vmInstantiationSimpleRankedNode'),

  instantiationTrusted: function () {
    var trustFound = false;

    this.get('sloGates').forEach( function(item, index, enumerable) {
      if (item.get('slo.sloType') === "trusted_platform") {
        trustFound = true;
      }

      //var match = item.get('description').toString().toLowerCase().indexOf("trust");
      //var match2 = item.get('description').toString().toLowerCase().indexOf("untrusted");
      //if (match !== -1) { //Trust is found as true
      //  trustFound = true;
      //}

    });

    return trustFound;

  }.property('sloGates.@each')

});
