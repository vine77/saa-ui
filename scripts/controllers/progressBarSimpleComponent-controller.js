App.ProgressBarSimpleComponent = Ember.Component.extend({
  thresholdOne: null,
  thresholdMax: null,
  progressStyle: function() {
    return 'overflow:visible;'+
      'position:relative;'+
      'height:10px;'+
      'margin-top:10px;'+
      'text-align:center;';
  }.property(),
  currentValueStyle: function() {
    var left = ~~this.get('barRange1Percentage');
    var right = 100 - left;
    if (this.get('barRange1Percentage') < 10) {
      return 'position:absolute; top:5px; left:' + left + '%';
    } else {
      return 'position:absolute; top:5px; right:' + right + '%';
    }
  }.property('barRange1Percentage'),
  barRange1Percentage: function() {
    return Math.min(Math.max(100 * this.get('value') / this.get('thresholdMax'), 0), 100);
  }.property('value', 'thresholdMax'),
  barRange1Style: function() {
    return 'width:' + this.get('barRange1Percentage') + '%';
  }.property('barRange1Percentage'),
});
