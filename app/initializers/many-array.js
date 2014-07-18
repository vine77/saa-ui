import Ember from 'ember';
import DS from 'ember-data';

export default {
  name: 'many-array',
  initialize: function(container, application) {
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
      relatedRecords: function() {
        var records = [];
        this.eachRelationship(function(name, relationship) {
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
  }
};
