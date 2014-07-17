// http://bl.ocks.org/benjchristensen/1148374
function displayGraph(selector, width, height, interpolation, animate, updateFrequency) {
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
  var line = d3.svg.line().x(function (d, i) {
    return x(i);
  }).y(function (d) {
    return y(d);
  }).interpolate(interpolation);
  graph.append('svg:path').attr('d', line(data));
  /*
  function redrawWithAnimation() {
    var v = data.shift();  // Remove first element from array
    data.push(v);  // Add a new element to the array
    // Update animation
    graph.selectAll('path')
      .data([data])  // Set new data
      .attr('transform', 'translate(' + x(1) + ')')  // Set the transform to the right by x(1) pixels to hide the new value
      .attr('d', line)  // Apply the new data values (hidden off the right of the canvas)
      .transition()  // Start a transition to bring the new value into view
      .ease('linear')
      .duration(updateFrequency)
      .attr('transform', 'translate(' + x(0) + ')');  // Animate a slide to the left back to x(0) pixels to reveal new value
  }
  function redrawWithoutAnimation() {
    var v = data.shift();
    data.push(v);
    graph.selectAll('path')
      .data([data])
      .attr('d', line);
  }
  if (animate) {
    redrawWithAnimation();
  } else {
    redrawWithoutAnimation();
  }
  setInterval(function () {
    if (animate) {
      redrawWithAnimation();
    } else {
      redrawWithoutAnimation();
    }
  }, updateFrequency);
  */
}

App.SparklineView = Ember.View.extend({
  tagName: 'span',
  classNames: ['sparkline'],
  didInsertElement: function () {
    displayGraph('#' + this.get('elementId'));
  }
});
