import Ember from 'ember';

// TODO: Port to real model
export default Ember.Object.extend({
  fullTitle: 'Intel® Datacenter Manager: Service Assurance Administrator',
  longTitle: 'Service Assurance Administrator',
  title: 'SAA',
  year: function() {
    return window.moment().format('YYYY');
  }.property(),
  apiDomain: function() {
    return localStorage.apiDomain;
  }.property()
}).create();
