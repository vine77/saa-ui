// TODO: This is not a real model or controller
App.Graphs = Ember.Controller.extend({
  graph: function(emberId, entityName, entityType) {
    hash = {
      url: ((!localStorage.apiDomain) ? '' : '//' + localStorage.apiDomain) + '/api/v1/graphs?entityType=' + entityType + '&entityName=' + entityName,
      type: 'GET',
      dataType: 'json',
      success: function (data, textStatus, jqXHR) {
        var numericArray = App.associativeToNumericArray(data);
        if (entityType == 'node') {
          this.store.find('node', emberId).set('graphs', numericArray);
        } else if (entityType == 'vm') {
          return this.store.find('vm', emberId).set('graphs', numericArray);
        }
      }
    }
    hash = $.extend(hash, App.ajaxSetup);
    return App.ajaxPromise(hash);
  }
});

App.graphs = App.Graphs.create();
