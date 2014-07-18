import Ember from 'ember';
import DS from 'ember-data';

export default DS.ActiveModelSerializer.extend({
  extractSingle: function(store, primaryType, payload, recordId, requestType) {
    // Add ID
    var json = Ember.$.extend(true, {}, payload);
    if (Ember.isEmpty(json.session.id)) json.session.id = recordId;
    return this._super(store, primaryType, json, recordId, requestType);
  }
});
