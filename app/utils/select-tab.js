import Ember from 'ember';

export default function(event) {
  var tabClassName = Ember.$(event.target).text().toLowerCase().replace(/ /g,'-');
  Ember.$(event.target).parent('li').addClass('active').siblings().removeClass('active');
  var tab = Ember.$(event.target).closest('.nav-tabs').next('.tab-content').find('.' + tabClassName);
  tab.addClass('active').siblings().removeClass('active');
}
