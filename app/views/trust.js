import Ember from 'ember';
import mtWilson from '../models/mt-wilson';

export default Ember.View.extend({
  didInsertElement: function() {
    mtWilson.checkPeriodically();
  },
  willDestroyElement: function() {
    clearInterval(mtWilson.mtWilsonTimer);
  }
});
