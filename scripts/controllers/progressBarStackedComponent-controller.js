App.ProgressBarStackedComponent = Ember.Component.extend({
  numberOfBars: 3,
  progressBarPercent: function() { //33.33% for each segment.
    return 100 / this.get('numberOfBars');
  }.property('numberOfBars'),

  thresholdMax: function() {
    return this.get('thresholdThree');
  }.property('thresholdThree'),

  progressBarOnePercent: function() {
    return (this.get('thresholdOne') - 0) / this.get('thresholdMax') * 100;
  }.property('thresholdOne', 'thresholdMax', 'value'),
  progressBarTwoPercent: function() {
    return (this.get('thresholdTwo') - this.get('thresholdOne')) / this.get('thresholdMax') * 100;
  }.property('thresholdOne', 'thresholdTwo', 'thresholdMax', 'value'),  
  progressBarThreePercent: function() {
    return (this.get('thresholdThree') - this.get('thresholdTwo')) / this.get('thresholdMax') * 100;
  }.property('thresholdTwo', 'thresholdThree', 'thresholdMax', 'value'),

  thresholdOne: null,
  thresholdTwo: null,
  thresholdThree: null,

  barRange1Percentage: function() {
    var result = this.get('value') / this.get('thresholdOne');
    var result = result * 100;
    var result = result / 100;
    var result = result * this.get('progressBarOnePercent');
    if (result > this.get('progressBarOnePercent')) {
      return this.get('progressBarOnePercent') + '%';
    } else {
      return result + '%';
    }
  }.property('value', 'thresholdOne', 'progressBarOnePercent'),
  barRange1PercentageWidth: function() {
    return 'width:' + this.get('barRange1Percentage');
  }.property('barRange1Percentage'),
  barRange2Percentage: function() {
    var result = this.get('value') - this.get('thresholdOne');
    if (result > 0) {
      var result = this.get('value') / this.get('thresholdTwo');
      var result = result * 100;
      var result = result / 100;
      var result = result * this.get('progressBarTwoPercent');
      if (result > this.get('progressBarTwoPercent')) {
        return this.get('progressBarTwoPercent') + '%';
      } else {
        return result + '%';
      }
    }
  }.property('value', 'thresholdOne', 'thresholdTwo', 'progressBarTwoPercent'),
  barRange2PercentageWidth: function() {
    return 'width:' + this.get('barRange2Percentage');
  }.property('barRange2Percentage'),
  barRange3Percentage: function() {
    var result = this.get('value') - this.get('thresholdTwo');
    if (result > 0) {
      var result = this.get('value') / this.get('thresholdThree');
      var result = result * 100;
      var result = result / 100;
      var result = result * this.get('progressBarThreePercent');
      if (result > this.get('progressBarThreePercent')) {
        return this.get('progressBarThreePercent') + '%';
      } else {
        return result + '%';
      }
    }
  }.property('value', 'thresholdOne', 'thresholdTwo','thresholdThree', 'progressBarThreePercent'),
  barRange3PercentageWidth: function() {
    return 'width:' + this.get('barRange3Percentage');
  }.property('barRange3Percentage')
});