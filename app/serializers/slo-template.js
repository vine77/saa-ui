import Ember from 'ember';
import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  normalize: function(type, hash, property) {
    // Force operators to be an array
    if (!Ember.isArray(hash.operators)) {
      hash.operators = [hash.operators];
    }
    // Force allowed_operators to be an array
    if (!Ember.isArray(hash.allowed_operators)) {
      hash.allowed_operators = [hash.allowed_operators];
    }
    return this._super(type, hash, property);
  },
});
