// TODO: This is not a real model or controller
App.Graphs = Ember.Controller.extend({
  graph: function(emberId, entityName, entityType, numSeries) {
    entityName = entityName.replace(/\./g, '-');
    var url = (App.getApiDomain()) + '/api/v1/graphs?entityType=' + entityType + '&entityName=' + entityName + '&graphVars={"colorList":"yellow,green,orange,red,blue,pink"}';
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
