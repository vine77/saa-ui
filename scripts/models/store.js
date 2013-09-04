App.ajaxSetup = {
  beforeSend: function(xhr) {
    if (App.session && App.session.get('csrf_token')) {
      xhr.setRequestHeader("X-CSRF-Token", App.session.get('csrf_token'));
    }
  }
};

App.ajaxPromise = function(hash) {
  return new Ember.RSVP.Promise(function (resolve, reject) {
    var success_callback = hash.success;
    var error_callback = hash.error;

    hash.success = function(json) {
      Ember.run(null, resolve, json);
      if (typeof success_callback !== 'undefined') {
        success_callback(json);
      }
    };
    hash.error = function(jqXHR, textStatus, errorThrown) {
      Ember.run(null, reject, jqXHR);
      if (typeof error_callback !== 'undefined') {
        error_callback(jqXHR, textStatus, errorThrown);
      }
    };
    jQuery.ajax(hash);
  });
}

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

// Configure pluralizations
DS.RESTAdapter.configure('plurals', {
  build: 'build',
  connectivity: 'connectivity',
  vm_instantiation_simple: 'vm_instantiation_simple',
  vm_instantiation_detailed: 'vm_instantiation_detailed',
  status: 'status'
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

/*
DS.Model.reopen({
});
*/
