App.Application = Ember.Object.extend({
  fullTitle: 'Intel® Service Assurance Manager',
  longTitle: 'Service Assurance Manager',
  title: 'SAM',
  year: function () {
    return moment().format('YYYY')
  }.property(),
  apiDomain: function () {
    return localStorage.apiDomain;
  }.property()
});
App.application = App.Application.create();
