import Ember from 'ember';
import DS from 'ember-data';
import Health from '../utils/mappings/health';
import log from '../utils/log';
import getApiDomain from '../utils/get-api-domain';
import notify from '../utils/notify';
import errorMessage from '../utils/error-message';

export default DS.ActiveModelAdapter.extend({
  host: getApiDomain(),
  namespace: 'api/v2',
  buildURL: function(type, id) {
    return this._super(type, id) + '.json';
  },

  /**
    Override the `ajaxError` method, using the errorMessage() helper
    to return a DS.InvalidError for all 422 Unprocessable Entity
    responses.

    @method ajaxError
    @param jqXHR
    @returns error
  */
  ajaxError: function(jqXHR) {
    if (jqXHR && jqXHR.status === 401) {
      var currentPath = window.App.route.controllerFor('application').get('currentPath');
      log(jqXHR.status + ' error caught by ajaxError.', jqXHR);
      if (currentPath !== 'login') {
        notify('Please log back in.', Health.ERROR, 'Unauthorized.');
        window.App.route.controllerFor('application').send('redirectToLogin', currentPath);
      }
    } else if (jqXHR && jqXHR.status === 422) {
      var jsonErrors = Ember.$.parseJSON(jqXHR.responseText)['errors'];
      if (!jsonErrors) jsonErrors = [errorMessage(Ember.$.parseJSON(jqXHR.responseText))];
      var errors = {};
      Ember.EnumerableUtils.forEach(Ember.keys(jsonErrors), function(key) {
        errors[Ember.String.camelize(key)] = jsonErrors[key];
      });
      return new DS.InvalidError(errors);
    } else {
      return this._super(jqXHR);
    }
  },


  /**
   * Fix query URL.
   */
  findMany: function(store, type, ids, owner) {
    return this.ajax(this.buildURL(type.typeKey), 'GET', {data: {ids: ids.join(',')}});
  },

  /**
   * Cast individual record to array,
   * and match the root key to the route
   */
  createRecord: function(store, type, record) {
    var data = {};
    data[this.pathForType(type.typeKey)] = [
      store.serializerFor(type.typeKey).serialize(record, {includeId: true})
    ];
    // Serialize sideloaded objects to compose compound document
    record.eachRelationship(function(key, relationship) {
      if (relationship.kind === 'hasMany') {
        var sideloadedData = this.serializeSideload(record, relationship);
        if (sideloadedData) data[this.keyForAttribute(relationship.key)] = sideloadedData;
      }
    }, store.serializerFor(type.typeKey));
    return this.ajax(this.buildURL(type.typeKey), "POST", {data: data});
  },

  /**
   * Cast individual record to array,
   * and match the root key to the route
   */
  updateRecord: function(store, type, record) {
    var data = {};
    data[this.pathForType(type.typeKey)] = [
      store.serializerFor(type.typeKey).serialize(record)
    ];
    var id = Ember.get(record, 'id');
    // Serialize sideloaded objects to compose compound document
    record.eachRelationship(function(key, relationship) {
      if (relationship.kind === 'hasMany') {
        var sideloadedData = this.serializeSideload(record, relationship);
        if (sideloadedData) data[this.keyForAttribute(relationship.key)] = sideloadedData;
      }
    }, store.serializerFor(type.typeKey));
    return this.ajax(this.buildURL(type.typeKey, id), "PUT", {data: data});
  }
});
