// TODO: Port this to a real model or controller
App.Graphs = Ember.Controller.extend({
  graph: function(emberId, entityName, entityType, numSeries, timeAgo) {
    entityName = entityName.replace(/\./g, '-');

    if (Ember.isEmpty(timeAgo)) { timeAgo = '-1hr'; }

    var url = (App.getApiDomain()) + '/api/v2/graphs?entityType=' + entityType + '&entityName=' + entityName + '&graphVars={"colorList":"yellow,green,orange,red,blue,pink", "from": "'+timeAgo+'"}';

    if (numSeries) url += '&numSeries=' + numSeries;
    return Ember.$.ajax({
      url: url,
      type: 'GET',
      dataType: 'json'
    }).then(function (data) {
      if (entityType == 'node') {
        App.store.getById('node', emberId).set('graphs', App.associativeToNumericArray(data));
      } else if (entityType == 'vm') {
        App.store.getById('vm', emberId).set('graphs', App.associativeToNumericArray(data));
      }
    });
  }
});
App.graphs = App.Graphs.create();
