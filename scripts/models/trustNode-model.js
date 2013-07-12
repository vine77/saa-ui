DS.RESTAdapter.map('App.TrustNode', {
  ipAddress: { key: 'IPAddress' }
});

App.TrustNode = DS.Model.extend({
  ipAddress: DS.attr('string'),
  vMM_Name: DS.attr('string'),
  email: DS.attr('string')
});
