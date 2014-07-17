import DS from 'ember-data';

export default DS.ActiveModelAdapter.extend({
  host: App.getApiDomain(),
  namespace: 'api/v2',
  buildURL: function(type, id) {
    return this._super(type, id) + '.json';
  }
});
