App.Graphs = Ember.Object.extend({
  graph: function(emberId, entityName, entityType) {
    hash = {
      url: ((!localStorage.apiDomain) ? '' : '//' + localStorage.apiDomain) + '/api/v1/graphs?entityType=' + entityType + '&entityName=' + entityName,
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
    }
    hash = $.extend(hash, App.ajaxSetup);
    return App.ajaxPromise(hash);
  }
});

App.graphs = App.Graphs.create();
