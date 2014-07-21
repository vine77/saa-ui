import Ember from 'ember';
import mtWilson from '../models/mt-wilson';

export default Ember.Route.extend({
  beforeModel: function() {
    // If Mt. Wilson is installed, go to MLEs
    if (mtWilson.get('isInstalled')) {
      this.transitionTo('trust.mles.index');
    } else {
      // If Mt. Wilson is installing, recheck status
      if (mtWilson.get('isInstalling')) mtWilson.check();
    }
  }
});
