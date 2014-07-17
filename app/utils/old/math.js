// Return the median of values in an array
App.median = function(values) {
  values.sort(function(a, b) {
    return a - b;
  });
  var half = Math.floor(values.length / 2);
  if (values.length % 2) {
    return values[half];
  } else {
    return (values[half - 1] + values[half]) / 2.0;
  }
};

// Return the mean of values in an array
App.median = function(values) {
  if (!Ember.isArray(values)) return NaN;
  var sum = values.reduce(function(previousValue, item) {
    return previousValue + item;
  }, 0);
  return sum / values.length;
};
