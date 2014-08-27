import Ember from 'ember';

export default Ember.View.extend({
  classNames: ['inline-block', 'tooltip-container'],
  attributeBindings: ['title', 'dataHtml:data-html','dataSelector:data-selector', 'dataContainer:data-container', 'dataPlacement:data-placement', 'displayFlag'],
  dataHtml: 'true',
  mouseEnter: function(event) {
    Ember.$('#' + this.get('elementId')).tooltip({container: 'body'}).tooltip('fixTitle').tooltip('show');
  },
  mouseLeave: function(event) {
    Ember.$('#' + this.get('elementId')).tooltip('hide');
  },
  willDestroyElement: function() {
    Ember.$('#' + this.get('elementId')).tooltip('hide');
  }
});
