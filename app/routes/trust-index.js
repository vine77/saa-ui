import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel: function () {
    // If Mt. Wilson is installed, go to MLEs
    if (App.mtWilson.get('isInstalled')) {
      this.transitionTo('trust.mles.index');
    } else {
      // If Mt. Wilson is installing, recheck status
      if (App.mtWilson.get('isInstalling')) App.mtWilson.check();
    }
  }
});
