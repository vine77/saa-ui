import Ember from 'ember';

export default Ember.Controller.extend({
  currentDomain: function() {
    return location.host;
  }.property(),
  apiDomain: Ember.computed.alias('application.apiDomain'),
  actions: {
    save: function() {
      localStorage.apiDomain = this.get('apiDomain');
      location.reload();
    },
    clear: function() {
      this.set('apiDomain', '');
      localStorage.apiDomain = '';
      location.reload();
    }
  }
});
