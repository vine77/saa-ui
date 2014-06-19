App.ProgressBarStackedComponent = Ember.Component.extend({
  numberOfBars: 3,
  progressBarPercent: function() { //33.33% for each segment.
    return 100 / this.get('numberOfBars');
  }.property('numberOfBars'),

  barRange1Max: null,
  barRange2Max: null,
  barRange3Max: null,

  barRange1Percentage: function() {
    if (this.get('value') >= this.get('barRange1Max')) {
      return this.get('progressBarPercent') + '%';
    } else if (this.get('value') < this.get('barRange1Max')) {
      return this.get('value') * this.get('progressBarPercent') + '%';
    }
  }.property('value', 'barRange1Max', 'progressBarPercent'),
  barRange1PercentageWidth: function() {
    return 'width:' + this.get('barRange1Percentage');
  }.property('barRange1Percentage'),
  barRange2Percentage: function() {
    if (this.get('value') >= this.get('barRange2Max')) {
      return this.get('progressBarPercent') + '%';
    } else if (this.get('value') > this.get('barRange1Max') && this.get('value') < this.get('barRange2Max')) {
      return (this.get('value') - this.get('barRange1Max')) * this.get('progressBarPercent') + '%';
    } else {
      return 0 + '%';
    }
  }.property('value', 'barRange1Max', 'barRange2Max', 'progressBarPercent'),
  barRange2PercentageWidth: function() {
    return 'width:' + this.get('barRange2Percentage');
  }.property('barRange2Percentage'),
  barRange3Percentage: function() {
    if (this.get('value') >= this.get('barRange3Max')) {
      return this.get('progressBarPercent') + '%';
    } else if (this.get('value') > this.get('barRange2Max') && this.get('value') < this.get('barRange3Max')) {
      return (this.get('value') - this.get('barRange2Max')) * this.get('progressBarPercent') + '%';
    } else {
      return 0 + '%';
    }
  }.property('value', 'barRange1Max', 'barRange2Max', 'progressBarPercent'),
  barRange3PercentageWidth: function() {
    return 'width:' + this.get('barRange3Percentage');
  }.property('barRange3Percentage')
});