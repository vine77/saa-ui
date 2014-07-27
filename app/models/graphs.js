import Ember from 'ember';
import getApiDomain from '../utils/get-api-domain';
import associativeToNumericArray from '../utils/associative-to-numeric-array';

// TODO: Port this to a real model or controller
export default Ember.Controller.extend({
  graph: function(emberId, entityName, entityType, numSeries, timeAgo) {
    entityName = entityName.replace(/\./g, '-');
    if (Ember.isEmpty(timeAgo)) timeAgo = '-1hr';
    var url = (getApiDomain()) + '/api/v2/graphs?entityType=' + entityType + '&entityName=' + entityName + '&graphVars={"colorList":"yellow,green,orange,red,blue,pink", "from": "' + timeAgo + '"}';
    if (numSeries) url += '&numSeries=' + numSeries;
    return Ember.$.ajax({
      url: url,
      type: 'GET',
      dataType: 'json'
    }).then(function(data) {
      if (entityType === 'node') {
        window.App.store.getById('node', emberId).set('graphs', associativeToNumericArray(data));
      } else if (entityType === 'vm') {
        window.App.store.getById('vm', emberId).set('graphs', associativeToNumericArray(data));
      }
    });
  }
}).create();
