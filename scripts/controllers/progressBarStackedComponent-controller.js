App.ProgressBarStackedComponent = Ember.Component.extend({
  numberOfBars: 3,
  progressBarPercent: function() { //33.33% for each segment.
    return 100 / this.get('numberOfBars');
  }.property('numberOfBars'),

  thresholdOne: null,
  thresholdTwo: null,
  thresholdThree: null,

  barRange1Percentage: function() {
    if (this.get('value') >= this.get('thresholdOne')) {
      return this.get('progressBarPercent') + '%';
    } else if (this.get('value') < this.get('thresholdOne')) {
      return this.get('value') * this.get('progressBarPercent') + '%';
    }
  }.property('value', 'thresholdOne', 'progressBarPercent'),
  barRange1PercentageWidth: function() {
    return 'width:' + this.get('barRange1Percentage');
  }.property('barRange1Percentage'),
  barRange2Percentage: function() {
    if (this.get('value') >= this.get('thresholdTwo')) {
      return this.get('progressBarPercent') + '%';
    } else if (this.get('value') > this.get('thresholdOne') && this.get('value') < this.get('thresholdTwo')) {
      return (this.get('value') - this.get('thresholdOne')) * this.get('progressBarPercent') + '%';
    } else {
      return 0 + '%';
    }
  }.property('value', 'thresholdOne', 'thresholdTwo', 'progressBarPercent'),
  barRange2PercentageWidth: function() {
    return 'width:' + this.get('barRange2Percentage');
  }.property('barRange2Percentage'),
  barRange3Percentage: function() {
    if (this.get('value') >= this.get('thresholdThree')) {
      return this.get('progressBarPercent') + '%';
    } else if (this.get('value') > this.get('thresholdTwo') && this.get('value') < this.get('thresholdThree')) {
      return (this.get('value') - this.get('thresholdTwo')) * this.get('progressBarPercent') + '%';
    } else {
      return 0 + '%';
    }
  }.property('value', 'thresholdOne', 'thresholdTwo', 'progressBarPercent'),
  barRange3PercentageWidth: function() {
    return 'width:' + this.get('barRange3Percentage');
  }.property('barRange3Percentage')
});