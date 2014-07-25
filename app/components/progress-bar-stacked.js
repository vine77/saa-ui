import Ember from 'ember';

export default Ember.Component.extend({
  overallWidth: '100%',
  thresholdOne: null,
  thresholdTwo: null,
  thresholdThree: null,
  thresholdMax: Ember.computed.alias('thresholdThree'),
  backgroundWidths: function() {
    var sum = Number(this.get('progressBarTwoPercent')) + Number(this.get('progressBarOnePercent'));
    return 'background-image:'+
      'linear-gradient('+
      ' to right,'+
      ' rgba(94, 185, 94, 0.3), '+
      ' rgba(94, 185, 94, 0.3) ' + this.get('progressBarOnePercent') + '%,'+
      ' rgba(250, 167, 50, 0.3) '+ this.get('progressBarOnePercent') + '%,'+
      ' rgba(250, 167, 50, 0.3) '+ sum + '%,' +
      ' rgba(221, 81, 76, 0.3) ' + sum + '%' +
      ');';
  }.property('progressBarOnePercent', 'progressBarTwoPercent', 'progressBarThreePercent'),
  progressStyle: function() {
    return 'width:' + this.get('overallWidth') + '; ' +
      this.get('backgroundWidths') +
      'overflow:visible;'+
      'position:relative;'+
      'height:10px;'+
      'margin-top:10px;'+
      'margin-left:5px;'+
      'text-align:center;';
  }.property('overallWidth', 'backgroundWidths'),
  currentValueStyle: function() {
    var right = ~~this.get('barRange1Percentage') + ~~this.get('barRange2Percentage') + ~~this.get('barRange3Percentage');
    right = 100 - right;
    if (right < 10) { // this is here for small case. consider extending later for different sizes.
      right = 0;
    } else if (right < 95) {
      right = right - 1;
    } else {
      right = right - 15;
    }
    return 'position:absolute; bottom:-14px; right:'+right+'%';
  }.property('value'),

  progressBarOnePercent: function() {
    return 100 * this.get('thresholdOne') / this.get('thresholdMax');
  }.property('thresholdOne', 'thresholdMax', 'value'),
  progressBarTwoPercent: function() {
    return 100 * (this.get('thresholdTwo') - this.get('thresholdOne')) / this.get('thresholdMax');
  }.property('thresholdOne', 'thresholdTwo', 'thresholdMax', 'value'),
  progressBarThreePercent: function() {
    return 100 * (this.get('thresholdThree') - this.get('thresholdTwo')) / this.get('thresholdMax');
  }.property('thresholdTwo', 'thresholdThree', 'thresholdMax', 'value'),

  barRange1Percentage: function() {
    var width = Math.min(this.get('value'), this.get('thresholdOne'));
    width = Math.max(width, 0);
    return 100 * width / this.get('thresholdMax');
  }.property('value', 'thresholdOne', 'thresholdMax'),
  barRange2Percentage: function() {
    var width = Math.min(this.get('value'), this.get('thresholdTwo')) - this.get('thresholdOne');
    width = Math.max(width, 0);
    return 100 * width / this.get('thresholdMax');
  }.property('value', 'thresholdOne', 'thresholdTwo'),
  barRange3Percentage: function() {
    var width = Math.min(this.get('value'), this.get('thresholdThree')) - this.get('thresholdTwo');
    width = Math.max(width, 0);
    return 100 * width / this.get('thresholdMax');
  }.property('value', 'thresholdTwo','thresholdThree'),

  barRange1Style: function() {
    return 'width:' + this.get('barRange1Percentage') + '%';
  }.property('barRange1Percentage'),
  barRange2Style: function() {
    return 'width:' + this.get('barRange2Percentage') + '%';
  }.property('barRange2Percentage'),
  barRange3Style: function() {
    return 'width:' + this.get('barRange3Percentage') + '%';
  }.property('barRange3Percentage')
});
