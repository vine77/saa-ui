import Ember from 'ember';
import DS from 'ember-data';

export default DS.Transform.extend({
  serialize: function(value) {
    return (Ember.typeOf(value) === 'array') ? value : [];
  },
  deserialize: function(value) {
    return value;
  }
});
