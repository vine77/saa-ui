import DS from 'ember-data';
import getApiDomain from '../utils/get-api-domain';

export default DS.ActiveModelAdapter.extend({
  host: getApiDomain(),
  namespace: 'api/v2',
  buildURL: function(type, id) {
    return this._super(type, id) + '.json';
  }
});
