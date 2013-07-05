App.Graphs = Ember.Object.extend({
  graph: function(emberId, entityName, entityType) {
    $.ajax({
      url: ((!localStorage.apiDomain) ? '' : '//' + localStorage.apiDomain) + '/graphs/getGraphs.php?entityType=' + entityType + '&entityName=' + entityName,
      type: 'GET',
      dataType: 'json',
      success: function (data, textStatus, jqXHR) {
        var numericArray = App.associativeToNumericArray(data);
        if (entityType == 'node') {
          App.Node.find(emberId).set('graphs', numericArray);
        } else if (entityType == 'vm') {
          return App.Vm.find(emberId).set('graphs', numericArray); 
        }
      }
    });
  }
});

App.graphs = App.Graphs.create();
