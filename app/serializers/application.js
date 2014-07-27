import Ember from 'ember';
import DS from 'ember-data';
var get = Ember.get;

export default DS.ActiveModelSerializer.extend({
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
      if (typeName === primaryTypeName && Ember.isArray(payload[key])) {
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
  extractFindAll: function(store, type, payload, id, requestType) {
    var missingRecords = [];
    var editingRecords = [];
    store.all(type).forEach(function(item, index, enumerable) {
      var payloadIds = payload[Object.keys(payload)[0]].getEach('id').map(function(item, index, enumerable) {
        return item.toString();
      });
      var isMissing = (payloadIds.indexOf(item.get('id').toString()) === -1);
      if (isMissing) missingRecords.push(item);
      if (item.get('isEditing')) editingRecords.push(item);
    });
    var extracted = this._super(store, type, payload, id, requestType);
    missingRecords.forEach(function(item, index, enumerable) {
      if (!item.get('isDirty')) item.unloadRecord();
    });
    return extracted.filter(function(item, index, enumerable) {
      return editingRecords.mapBy('id').indexOf(item.id) === -1;
    });
  }
});
