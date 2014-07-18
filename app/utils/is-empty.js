import Ember from 'ember';

export default function(value) {
  return (Ember.isEmpty(value) || value === -1);
}
