App.Application = Ember.Object.extend({
  fullTitle: 'Intel® Service Assurance Administrator',
  longTitle: 'Service Assurance Administrator',
  title: 'Open SAA',
  year: function () {
    return moment().format('YYYY');
  }.property(),
  apiDomain: function () {
    return localStorage.apiDomain;
  }.property()
});
App.application = App.Application.create();
