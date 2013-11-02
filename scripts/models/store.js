App.ApplicationAdapter = DS.ActiveModelAdapter.extend({
  host: (!localStorage.apiDomain) ? '' : '//' + localStorage.apiDomain,
  namespace: 'api/v1',
  buildURL: function(type, id) {
    return this._super(type, id) + '.json';
  },

  /**
    Override the `ajaxError` method, using the App.errorMessage() helper
    to return a DS.InvalidError for all 422 Unprocessable Entity
    responses.

    @method ajaxError
    @param jqXHR
    @returns error
  */
  ajaxError: function(jqXHR) {
    if (jqXHR && jqXHR.status === 422) {
      var jsonErrors = Ember.$.parseJSON(jqXHR.responseText)['errors'];
      if (!jsonErrors) jsonErrors = [App.errorMessage(Ember.$.parseJSON(jqXHR.responseText))];
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

    return this.ajax(this.buildURL(type.typeKey, id), "PUT", {data: data});
  }
});

App.ApplicationSerializer = DS.ActiveModelSerializer.extend({
  normalize: function(type, hash, property) {
    var json = hash;
    delete json.links;  // Don't use "links" yet, until JSON-API spec is implemented API-wide
    return this._super(type, json, property);
  },

  /**
   * Patch the extractSingle method, since there are no singular records
   */
  extractSingle: function(store, primaryType, payload, recordId, requestType) {
    var primaryTypeName = primaryType.typeKey;
    var json = {};
    for(var key in payload) {
      var typeName = Ember.String.singularize(key);
      if(typeName === primaryTypeName && Ember.isArray(payload[key])) {
        json[typeName] = payload[key][0];
      } else {
        json[key] = payload[key];
      }
    }
    return this._super(store, primaryType, json, recordId, requestType);
  },

  /**
   * Patch the extractFindAll method to unload records not present in findAll requests
   */
  extractFindAll: function (store, type, payload, id, requestType) {
    var missingRecords = [];
    store.all(type).forEach(function (item, index, enumerable) {
      var payloadIds = payload[Object.keys(payload)[0]].getEach('id').map(function (item, index, enumerable) {
        return item.toString();
      });
      var isMissing = (payloadIds.indexOf(item.get('id').toString()) === -1);
      if (isMissing) missingRecords.push(item);
    });
    var extracted = this._super(store, type, payload, id, requestType);
    missingRecords.forEach(function (item, index, enumerable) {
      item.unloadRecord();
    });
    return extracted;
  }
});

// RESTSingletonAdapter for singleton resources in primary namespace
DS.RESTSingletonAdapter = App.ApplicationAdapter.extend({
  // Remove ID from this singleton resource
  buildURL: function (type, id) {
    return this._super(type);
  }
});

// RESTDefinitionsAdapter
DS.RESTSingletonDefinitionsAdapter = DS.RESTSingletonAdapter.extend({
  namespace: 'definitions'
});

Ember.Inflector.inflector.uncountable('vm_instantiation_simple');
Ember.Inflector.inflector.uncountable('vm_instantiation_detailed');

// Add additional Ember Data types
App.ArrayTransform = DS.Transform.extend({
  serialize: function(value) {
    return (Em.typeOf(value) === 'array') ? value : [];
  },
  deserialize: function(value) {
    return value;
  }
});


// TODO: Move Sunil's header token extension to broader solution
/*
App.ajaxSetup = {
  beforeSend: function(xhr) {
    if (App.session && App.session.get('csrf_token')) {
      xhr.setRequestHeader("X-CSRF-Token", App.session.get('csrf_token'));
    }
  }
};
*/
