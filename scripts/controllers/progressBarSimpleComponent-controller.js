App.ProgressBarSimpleComponent = Ember.Component.extend({
  thresholdOne: null,
  thresholdMax: null,
  progressBarColor: 'bar-success',
  bytesToReadableSize: false,
  displayMaximum: true,
  progressStyle: function() {
    return 'overflow:visible;'+
      'position:relative;'+
      'height:10px;'+
      'margin-top:10px;'+
      'text-align:center;';
  }.property(),
  currentValueStyle: function() {
    if (this.get('bytesToReadableSize')) {
      return 'position:absolute; top:3px; white-space: nowrap; left:0%';
    } else {
      var left = ~~this.get('barRange1Percentage');
      var right = 100 - left;
      if (this.get('barRange1Percentage') < 15) {
        return 'position:absolute; top:5px; white-space: nowrap; left:' + left + '%';
      } else {
        return 'position:absolute; top:5px; white-space: nowrap; right:' + right + '%';
      }
    }
  }.property('barRange1Percentage'),
  barRange1Percentage: function() {
    return Math.min(Math.max(100 * this.get('value') / this.get('thresholdMax'), 0), 100);
  }.property('value', 'thresholdMax'),
  barRange1Style: function() {
    return 'width:' + this.get('barRange1Percentage') + '%';
  }.property('barRange1Percentage'),
  thresholdMaxFormatted: function() {
    if (this.get('bytesToReadableSize')) {
      return App.bytesToReadableSize(this.get('thresholdMax'));
    } else {
      return this.get('thresholdMax');
    }
  }.property('thresholdMax'),
  valueFormatted: function() {
    if (this.get('bytesToReadableSize')) {
      return App.bytesToReadableSize(this.get('value'));
    } else {
      return this.get('value');
    }
  }.property('value')
});
