// TODO: This is not a real model or controller
App.Graphs = Ember.Controller.extend({
  graph: function(emberId, entityName, entityType) {
    return Ember.$.ajax({
      url: ((!localStorage.apiDomain) ? '' : '//' + localStorage.apiDomain) + '/api/v1/graphs?entityType=' + entityType + '&entityName=' + entityName,
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
