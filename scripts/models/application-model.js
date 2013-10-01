App.Application = Ember.Object.extend({
  fullTitle: 'Intel® Service Assurance Manager',
  longTitle: 'Service Assurance Manager',
  title: 'SAM',
  year: function () {
    return moment().format('YYYY')
  }.property(),
  apiDomain: function () {
    return localStorage.apiDomain;
  }.property(),
  health: App.SUCCESS,
  isEnabled: function () {
    return this.get('health') <= App.WARNING && App.nova.get('exists') && App.openrc.get('exists') && App.quantum.get('exists');
  }.property('App.nova.exists', 'App.openrc.exists', 'App.quantum.exists', 'health')
});
App.application = App.Application.create();
