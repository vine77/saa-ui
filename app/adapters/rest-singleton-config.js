import RESTSingletonAdapter from './rest-singleton';

// RESTSingletonConfigAdapter for singleton resources in configuration namespace
export default RESTSingletonAdapter.extend({
  namespace: 'api/v2/configuration'
});
