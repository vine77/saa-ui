import Ember from 'ember';

/**
 * Debounced observers that will only fire once at end of interval if no additional calls have been made
 */
export default function (debounceFunction, property, interval) {
  return Ember.observer(function () {
    Ember.run.debounce(this, debounceFunction, interval);
  }, property);
}
