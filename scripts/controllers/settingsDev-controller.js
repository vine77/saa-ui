App.SettingsDevController = Ember.Controller.extend({
  currentDomain: function () {
    return location.host;
  }.property(),
  apiDomainBinding: 'App.application.apiDomain',
  actions: {
    save: function () {
      localStorage.apiDomain = this.get('apiDomain');
      location.reload();
    },
    clear: function () {
      this.set('apiDomain', '');
      localStorage.apiDomain = '';
      location.reload();
    }
  }

});
