import ApplicationAdapter from 'application';

// RESTSingletonAdapter for singleton resources in primary namespace
export default ApplicationAdapter.extend({
  // Remove ID from this singleton resource
  buildURL: function(type, id) {
    return this._super(type);
  }
});
