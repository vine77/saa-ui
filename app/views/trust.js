App.TrustView = Ember.View.extend({
  didInsertElement: function () {
    App.mtWilson.checkPeriodically();
  },
  willDestroyElement: function () {
    clearInterval(App.mtWilsonCheck);
  }
});
