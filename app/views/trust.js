import Ember from 'ember';

export default Ember.View.extend({
  didInsertElement: function() {
    App.mtWilson.checkPeriodically();
  },
  willDestroyElement: function() {
    clearInterval(App.mtWilsonCheck);
  }
});
