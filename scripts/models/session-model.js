App.SessionAdapter = DS.ActiveModelAdapter.extend({
  host: App.getApiDomain(),
  namespace: 'api/v1',
  buildURL: function(type, id) {
    return this._super(type, id) + '.json';
  }
});

App.SessionSerializer = DS.ActiveModelSerializer.extend({
  extractSingle: function(store, primaryType, payload, recordId, requestType) {
    // Add ID
    var json = Ember.$.extend(true, {}, payload);
    if (Ember.isEmpty(json.session.id)) json.session.id = recordId;
    return this._super(store, primaryType, json, recordId, requestType);
  }
});

App.Session = DS.Model.extend({
  username: DS.attr('string'),
  password: DS.attr('string'),
  csrfToken: DS.attr('string'),
  key: DS.attr('string'),
  tenant: DS.attr('string')
});
