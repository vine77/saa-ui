import Ember from 'ember';

export default function(values) {
  if (!Ember.isArray(values)) return NaN;
  var sum = values.reduce(function(previousValue, item) {
    return previousValue + item;
  }, 0);
  return sum / values.length;
}
