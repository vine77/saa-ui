App.ApplicationAdapter = DS.ActiveModelAdapter.extend({
  host: App.getApiDomain(),
  namespace: 'api/v2',
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
    if (jqXHR && jqXHR.status === 401) {
      var currentPath = App.route.controllerFor('application').get('currentPath');
      App.log(jqXHR.status + ' error caught by ajaxError.', jqXHR);
      if (currentPath !== 'login') {
        App.notify('Please log back in.', App.ERROR, 'Unauthorized.');
        App.route.controllerFor('application').send('redirectToLogin', currentPath);
      }
    } else if (jqXHR && jqXHR.status === 422) {
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

App.ApplicationSerializer = DS.ActiveModelSerializer.extend({
  serializeSideload: function(record, relationship) {
    var key = relationship.key;
    var attrs = get(this, 'attrs');
    var sideload = attrs && attrs[key] && attrs[key].sideload === 'always';

    if (sideload) {
      return get(record, key).map(function(relation) {
        var data = relation.serialize();
        var primaryKey = get(this, 'primaryKey');
        data[primaryKey] = get(relation, primaryKey);
        return data;
      }, this);
    }
  },

  /**
    Serialize has-may relationships

    @method serializeHasMany
  */
  serializeHasMany: function(record, json, relationship) {
    var key   = relationship.key,
        attrs = get(this, 'attrs'),
        embed = attrs && attrs[key] && attrs[key].embedded === 'always';
    if (embed) {
      json[this.keyForAttribute(key)] = get(record, key).map(function(relation) {
        var data = relation.serialize(),
            primaryKey = get(this, 'primaryKey');
        data[primaryKey] = get(relation, primaryKey);
        return data;
      }, this);
    } else {
      var relationshipType = DS.RelationshipChange.determineRelationshipType(record.constructor, relationship);
      var keyName = (this.keyForRelationship) ? this.keyForRelationship(key, relationshipType) : key;
      json[keyName] = get(record, key).mapBy('id');
    }
  },

  /**
    Underscores relationship names and appends "_id" or "_ids" when serializing
    relationship keys.

    @method keyForRelationship
    @param {String} key
    @param {String} kind
    @returns String
  */
  keyForRelationship: function(key, kind) {
    key = Ember.String.decamelize(key);
    if (kind === "belongsTo") {
      return key + "_id";
    } else if (kind === "hasMany" || kind === "manyToOne") {
      return Ember.String.singularize(key) + "_ids";
    } else {
      return key;
    }
  },

  normalize: function(type, hash, property) {
    var json = hash;
    delete json.links;  // Don't use "links" yet, until JSON-API spec is implemented API-wide
    return this._super(type, json, property);
  },

  /**
   * Patch the extractSingle method, since there are no singular records, allowing additional sideloaded records of primary type
   */
  extractSingle: function(store, primaryType, payload, recordId, requestType) {
    var primaryTypeName = primaryType.typeKey;
    var json = {};
    for(var key in payload) {
      var typeName = Ember.String.singularize(key);
      if(typeName === primaryTypeName && Ember.isArray(payload[key])) {
        json[typeName] = payload[key][0];
        if (payload[key].length > 1) {
          json['_' + key] = payload[key].slice(1);
        }
      } else {
        json[key] = payload[key];
      }
    }
    return this._super(store, primaryType, json, recordId, requestType);
  },

  /**
   * Patch the extractFindAll method to unload records not present in findAll requests, and ignore "isEditing" records
   */
  extractFindAll: function (store, type, payload, id, requestType) {
    var missingRecords = [];
    var editingRecords = [];
    store.all(type).forEach(function (item, index, enumerable) {
      var payloadIds = payload[Object.keys(payload)[0]].getEach('id').map(function (item, index, enumerable) {
        return item.toString();
      });
      var isMissing = (payloadIds.indexOf(item.get('id').toString()) === -1);
      if (isMissing) missingRecords.push(item);
      if (item.get('isEditing')) editingRecords.push(item);
    });
    var extracted = this._super(store, type, payload, id, requestType);
    missingRecords.forEach(function (item, index, enumerable) {
      if (!item.get('isDirty')) item.unloadRecord();
    });
    return extracted.filter(function (item, index, enumerable) {
      return editingRecords.mapBy('id').indexOf(item.id) === -1;
    });
  }
});

// RESTConfigAdapter for nested configuration namespace
DS.RESTConfigAdapter = App.ApplicationAdapter.extend({
  namespace: 'api/v2/configuration'
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
  namespace: 'api/v2/configuration'
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

// Add methods on the Model class for interacting with records
DS.Model.reopen({
  clearInverseRelationships: function() {
    this.eachRelationship(function(name, relationship){
      if (relationship.kind === 'belongsTo') {
        var inverse = relationship.parentType.inverseFor(name);
        var parent = this.get(name);
        if (inverse && parent) parent.get(inverse.name).removeObject(this);
      }
    }, this);
  },
  relatedRecords: function () {
    var records = [];
    this.eachRelationship(function (name, relationship) {
      var related = this.get(name);
      if (!Ember.isEmpty(related)) {
        if (Ember.isArray(related)) {
          records.addObjects(related);
        } else {
          records.addObject(related);
        }
      }
    }, this);
    return records;
  }
});
