import Ember from 'ember';

export default Ember.View.extend({
  tagName: 'span',
  classNames: ['sparkline'],
  displayGraph: function(selector, width, height, interpolation, animate, updateFrequency) {
    // http://bl.ocks.org/benjchristensen/1148374
    if (typeof selector === 'undefined') selector = '.sparkline';
    if (typeof width === 'undefined') width = 150;
    if (typeof height === 'undefined') height = 20;
    if (typeof interpolation === 'undefined') interpolation = 'basis';
    if (typeof animate === 'undefined') animate = true;
    if (typeof updateFrequency === 'undefined') updateFrequency = 3000;
    var graph = d3.select(selector).append('svg:svg').attr('width', '100%').attr('height', '100%');
    var data = [3, 6, 2, 7, 5, 2, 1, 3, 8, 9, 2, 5, 9, 3, 6, 3, 6, 2, 7, 5, 2, 1, 3, 8, 9, 2, 5, 9, 2, 7, 5, 2, 1, 3, 8, 9, 2, 5, 9, 3, 6, 2, 7, 5, 2, 1, 3, 8, 9, 2, 9];
    // Functions for scaling along axes
    var x = d3.scale.linear().domain([0, 48]).range([-5, width]);  // Starting point is -5 so first value doesn't show and slides off edge as part of transition
    var y = d3.scale.linear().domain([0, 10]).range([0, height]);
    // Set up graph
    var line = d3.svg.line().x(function(d, i) {
      return x(i);
    }).y(function(d) {
      return y(d);
    }).interpolate(interpolation);
    graph.append('svg:path').attr('d', line(data));
  },
  didInsertElement: function() {
    this.displayGraph('#' + this.get('elementId'));
  }
});
