App.ProgressBarStackedComponent = Ember.Component.extend({
  overallWidth: '100%',
  thresholdOne: null,
  thresholdTwo: null,
  thresholdThree: null,
  thresholdMax: function() {
    globalThis = this;
    return this.get('thresholdThree');
  }.property('thresholdThree'),
  areEvenThresholds: function() {
    return ((this.get('thresholdOne') - 0) == (this.get('thresholdTwo') - this.get('thresholdOne')) == (this.get('thresholdThree') - this.get('thresholdTwo')));
  }.property('thresholdOne', 'thresholdTwo', 'thresholdThree'),
  backgroundWidths: function() {
    var sum = Number(this.get('progressBarTwoPercent')) + Number(this.get('progressBarOnePercent'));
    var returnValue = 'background-image:'+
    'linear-gradient('+
    ' to right,'+
    ' rgba(94, 185, 94, 0.3), '+
    ' rgba(94, 185, 94, 0.3) ' + this.get('progressBarOnePercent') + '%,'+
    ' rgba(250, 167, 50, 0.3) '+ this.get('progressBarOnePercent') + '%,'+
    ' rgba(250, 167, 50, 0.3) '+ sum + '%,' +
    ' rgba(221, 81, 76, 0.3) ' + sum + '%' +
    ');';
    return returnValue;
  }.property('progressBarOnePercent', 'progressBarTwoPercent', 'progressBarThreePercent'),
  styles: function() {
    return 'width:' + this.get('overallWidth') + '; ' + 
    this.get('backgroundWidths') +
    'overflow:visible;'+
    'position:relative;'+
    'height:10px;'+
    'margin-top:10px;'+
    'margin-left:5px;'+
    'text-align:center;';
  }.property('overallWidth', 'backgroundWidths'),
  currentValueStyles: function() {
    var right = ~~this.get('barRange1Percentage') + ~~this.get('barRange2Percentage') + ~~this.get('barRange3Percentage');
    right = 100 - right;
    if (right < 25) {
      right = right - 20;
    } else if (right < 95) {
      right = right - 5;
    } else {
      right = right - 15;
    }
    return 'position:absolute; bottom:-14px; right:'+right+'%';
  }.property('value'),
  progressBarOnePercent: function() {
    return (this.get('thresholdOne') - 0) / this.get('thresholdMax') * 100;
  }.property('thresholdOne', 'thresholdMax', 'value'),
  progressBarTwoPercent: function() {
    return (this.get('thresholdTwo') - this.get('thresholdOne')) / this.get('thresholdMax') * 100;
  }.property('thresholdOne', 'thresholdTwo', 'thresholdMax', 'value'),  
  progressBarThreePercent: function() {
    return (this.get('thresholdThree') - this.get('thresholdTwo')) / this.get('thresholdMax') * 100;
  }.property('thresholdTwo', 'thresholdThree', 'thresholdMax', 'value'),
  barRange1Percentage: function() {
    var result = this.get('value') / this.get('thresholdOne');
    var result = result * 100;
    var result = result / 100;
    var result = result * this.get('progressBarOnePercent');
    if (result > this.get('progressBarOnePercent')) {
      return this.get('progressBarOnePercent');
    } else {
      return result;
    }
  }.property('value', 'thresholdOne', 'progressBarOnePercent'),
  barRange1PercentageWidth: function() {
    return 'width:' + this.get('barRange1Percentage') + '%';
  }.property('barRange1Percentage'),
  barRange2Percentage: function() {
    if (this.get('value') > this.get('thresholdOne') && this.get('value') <= this.get('thresholdTwo')) {
      if (this.get('areEvenThresholds')) {
        var result = this.get('value') - this.get('thresholdOne');
      } else {
        var result = this.get('value');
      }
      if (result > 0) {
        var result = result.toFixed(2);
        if (result > 1) { 
          var result = result / this.get('thresholdTwo'); 
        }
        var result = result * 100;
        var result = result / 100;
        var result = result * this.get('progressBarTwoPercent');
        if (result > this.get('progressBarTwoPercent')) {
          return this.get('progressBarTwoPercent');
        } else {
          return result;
        }
      }
    } else if (this.get('value') >= this.get('thresholdTwo')) {
      return this.get('progressBarTwoPercent');
    } else {
      return 0;
    }
  }.property('value', 'thresholdOne', 'thresholdTwo', 'progressBarTwoPercent'),
  barRange2PercentageWidth: function() {
    return 'width:' + this.get('barRange2Percentage') + '%';
  }.property('barRange2Percentage'),
  barRange3Percentage: function() {
    if (this.get('value') > this.get('thresholdTwo') && this.get('value') <= this.get('thresholdThree')) {
      if (this.get('areEvenThresholds')) {
        var result = this.get('value') - this.get('thresholdTwo');
      } else {
        var result = this.get('value');
      }
      if (result > 0) {
        var result = result.toFixed(2);
        if (result > 1) { 
          var result = result / this.get('thresholdThree'); 
        }
        var result = result * 100;
        var result = result / 100;
        var result = result * this.get('progressBarThreePercent');
        if (result > this.get('progressBarThreePercent')) {
          return this.get('progressBarThreePercent');
        } else {
          return result;
        }
      }
    } else if (this.get('value') >= this.get('thresholdThree')) {
      return this.get('progressBarThreePercent');
    } else {
      return 0;
    }
  }.property('value', 'thresholdOne', 'thresholdTwo','thresholdThree', 'progressBarThreePercent'),
  barRange3PercentageWidth: function() {
    return 'width:' + this.get('barRange3Percentage') + '%';
  }.property('barRange3Percentage')
});