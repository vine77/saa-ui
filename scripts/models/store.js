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
  }
});

// RESTConfigAdapter for nested configuration namespace
DS.RESTConfigAdapter = App.ApplicationAdapter.extend({
  namespace: 'api/v1/configuration'
});

// RESTSingletonAdapter for singleton resources in primary namespace
DS.RESTSingletonAdapter = App.ApplicationAdapter.extend({
  // Remove ID from this singleton resource
  buildURL: function (type, id) {
    return this._super(type);
  }
});

// RESTSingletonConfigAdapter for singleton resources in configuration namespace
DS.RESTSingletonConfigAdapter = DS.RESTSingletonAdapter.extend({
  namespace: 'api/v1/configuration'
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

/*
// Configure primary SAM REST adapter
DS.RESTAdapter.reopen({
  url: (!localStorage.apiDomain) ? '' : '//' + localStorage.apiDomain,
  namespace: 'api/v1',
  bulkCommit: false,
  buildURL: function (record, suffix) {
    var url = this._super(record, suffix);
    return url + '.json';
  },
  findAll: function(store, type, since, deleteMissing, customErrorHandling) {  // findAll customErrorHandling series exit point
    globalStore = store;

    var root, adapter;

    root = this.rootForType(type);
    adapter = this;

    var storedJson;

    return this.ajax(this.buildURL(root), "GET", {
      data: this.sinceQuery(since)
    }).then(function(json) {
        storedJson = json;
        adapter.didFindAll(store, type, json);
      }, function(error) {
        store.didUpdateAll(type);
        if (customErrorHandling) {
          App.event(App.errorMessage(JSON.parse(error.responseText)), App.ERROR, false);
        }
      }
    ).then(function () {
      if (deleteMissing) {
        // TODO: Can't call type this way
        eval(type).all().toArray().forEach(function (item, index, enumerable) {
          var missing = JSON.stringify(storedJson).indexOf(item.get('id')) === -1;
          if (missing) {
            item.unloadRecord();
          }
        });
      }
    }, DS.rejectionHandler);
  },
  didError: function (store, type, record, xhr) {
    var json = (xhr.responseText) ? JSON.parse(xhr.responseText) : {};
    record.set('error', App.errorMessage(json));  // Store error message on record
    if (xhr.status === 422) {
      // Handle cases where backend response is not in expected format for validation errors
      if (!json.hasOwnProperty('errors')) {
        json = {"errors": json};  // Standardized object to pass to _super()
        xhr.responseText = JSON.stringify(json);
      }
      this._super(store, type, record, xhr);
    } else {
      this._super.apply(this, arguments);
    }
  },
  ajax: function(url, type, hash) {
    var adapter = this;

    return new Ember.RSVP.Promise(function(resolve, reject) {
      hash = hash || {};

      // Customization: Merge settings from App object
      hash = $.extend(hash, App.ajaxSetup);

      hash.url = url;
      hash.type = type;
      hash.dataType = 'json';
      hash.context = adapter;

      if (hash.data && type !== 'GET') {
        hash.contentType = 'application/json; charset=utf-8';
        hash.data = JSON.stringify(hash.data);
      }

      hash.success = function(json) {
        Ember.run(null, resolve, json);
      };

      hash.error = function(jqXHR, textStatus, errorThrown) {
        //Customization: Bug Bug. Latest Ember data is called properly.
        Ember.run(null, reject, jqXHR);
      };

      jQuery.ajax(hash);
    });
  }
});

// Add additional Ember Data types
DS.RESTAdapter.registerTransform('array', {
  serialize: function(value) {
    return (Em.typeOf(value) === 'array') ? value : [];
  },
  deserialize: function(value) {
    return value;
  }
});

// RESTConfigAdapter for nested configuration namespace
DS.RESTConfigAdapter = DS.RESTAdapter.extend();
DS.RESTConfigAdapter.reopen({
  namespace: 'api/v1/configuration'
});

// RESTSingletonAdapter for singleton resources in primary namespace
DS.RESTSingletonAdapter = DS.RESTAdapter.extend();
DS.RESTSingletonAdapter.reopen({
  buildURL: function (record, suffix) {
    suffix = undefined;  // Remove ID from this singleton resource
    return this._super(record, suffix);
  }
});

// RESTSingletonConfigAdapter for singleton resources in configuration namespace
DS.RESTSingletonConfigAdapter = DS.RESTSingletonAdapter.extend();
DS.RESTSingletonConfigAdapter.reopen({
  namespace: 'api/v1/configuration'
});

App.Store = DS.Store.extend({
  adapter: DS.RESTAdapter,
  findMany: function(type, idsOrReferencesOrOpaque, record, relationship) {
    if (idsOrReferencesOrOpaque === null) idsOrReferencesOrOpaque = [];
    return this._super(type, idsOrReferencesOrOpaque, record, relationship);
  },
  find: function (type, id, deleteMissing, customErrorHandling) {  // findAll customErrorHandling series entry point
    if ((id === undefined) && (deleteMissing || customErrorHandling))  {
      return this.findAll(type, deleteMissing, customErrorHandling);
    } else {
      return this._super(type, id);
    }
  },
  findAll: function(type, deleteMissing, customErrorHandling) {  // findAll customErrorHandling series
    if (deleteMissing || customErrorHandling) {
      return this.fetchAll(type, this.all(type), deleteMissing, customErrorHandling);
    } else {
      return this._super(type);
    }
  },
  fetchAll: function(type, array, deleteMissing, customErrorHandling) {  // findAll customErrorHandling series
    if (deleteMissing || customErrorHandling) {

      var get = Ember.get, set = Ember.set; //prerequistes

      var adapter = this.adapterForType(type),
      sinceToken = this.typeMapFor(type).metadata.since;

      set(array, 'isUpdating', true);

      Ember.assert("You tried to load all records but you have no adapter (for " + type + ")", adapter);
      Ember.assert("You tried to load all records but your adapter does not implement `findAll`", adapter.findAll);

      adapter.findAll(this, type, sinceToken, deleteMissing, customErrorHandling);

      return array;
    } else {
      return this._super(type, array);
    }
  }
});
*/
