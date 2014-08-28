/**
 * Creates a multiple segment progress bar with independent ranges.
 * It can accept an arbitrary number of progress bars.
 *
 * @ Handlebars Usage Example:
 * {{progress-bar-adjacent numberOfBars="3"
 * barMin1="0" barMax1="20" barValue1="15" barLabel1="OS SCU Usage"
 * barMin2="40" barMax2="80" barValue2="50" barLabel2="VM SCU Usage"
 * barMin3="0" barMax3="50" barValue3="4" barLabel3="Testing Usage"}}
 *
 */
App.ProgressBarAdjacentComponent = Ember.Component.extend({
  maxTotal: 0,
  styleBinding: 'width:30px;',
  classNames: ['progress-bar-adjacent-container'],

  bars: function() {
    var i = 1;
    if (!!this.get('values')) {
      var self = this;
      this.get('values').forEach( function(item, index, enumerable) {
        if (typeof item.min != 'undefined') { self.set('barMin' + i, item.min); }
        if (typeof item.max != 'undefined') { self.set('barMax' + i, item.max); }
        if (typeof item.value != 'undefined') { self.set('barValue' + i, item.value); }
        if (typeof item.color != 'undefined') { self.set('barColor' + i, item.color); }
        i++;
      });
    }
    this.set('numberOfBars', this.get('values.length'));
    // Get the max total.
    var i = 1;
    var maxTotal = 0;
    while (i <= this.get('numberOfBars')) {
      var max = this.get('barMax' + i);
      if (max) {
        maxTotal = parseInt(max) + parseInt(maxTotal);
      }
      i++;
    }

    this.set('maxTotal', maxTotal);
    var returnBars = [];
    var i = 1;
    while (i <= this.get('numberOfBars')) {
      var min = this.get('barMin' + i);
      var max = this.get('barMax' + i);
      var current = this.get('barValue' + i);
      var label = this.get('barLabel' + i);
      var title = this.get('barTitle' + i);
      var color = this.get('barColor' + i);
      returnBars.push(
        App.ProgressBarAdjacentController.create({
          min: min,
          max: max,
          maxTotal: this.get('maxTotal'),
          current: current,
          numberOfBars: this.get('numberOfBars'),
          barCount: i,
          barColor: color,
          label: label,
          title: title
        })
      );
      this.addObserver('barValue' + i, this, this.notifyBars);
      this.addObserver('barLabel' + i, this, this.notifyBars);
      this.addObserver('barTitle' + i, this, this.notifyBars);
      this.addObserver('barMin' + i, this, this.notifyBars);
      this.addObserver('barMax' + i, this, this.notifyBars);
      this.addObserver('barColor' + i, this, this.notifyBars);
      i++;
    }
    return returnBars;
  //}.property('numberOfBars', 'values'),
  }.property('tooltip'),
  notifyBars: function() {
    this.notifyPropertyChange('bars');
  }
});

App.ProgressBarAdjacentController = Ember.ObjectController.extend({
  progressBarColors: ['progress-info', 'progress-success', 'progress-warning', 'progress-danger', 'progress-neutral'],
  currentExceedsMax: function() {
    return (this.get('current') > this.get('max'));
  }.property('max', 'current'),
  progressBarColor: function() {
    if (this.get('currentExceedsMax')) {
      return this.get('progressBarColors')[3];
    } else {
      if (!!this.get('barColor')) {
        if (this.get('barColor') == 'progress-neutral') {
          return this.get('progressBarColors')[4];
        }
      } else {
        if (this.get('barCount') == 1) {
          return this.get('progressBarColors')[0];
        } else if (this.get('barCount') % 2 == 0) {
          return this.get('progressBarColors')[1];
        } else if (this.get('barCount') % 3 == 0) {
          return this.get('progressBarColors')[2];
        }
        //} else if (this.get('barCount') % 4 == 0) {
        //  return this.get('progressBarColors')[3];
        //}
      }
    }
  }.property('progressBarColors', 'barCount', 'barColor', 'currentExceedsMax'),
  progressBarBackground: function() {
    if (!!this.get('barColor')) {
      if (this.get('barColor') == 'progress-neutral') {
        return 'rgba(220, 220, 220, 0.25)';
      }
    } else {
      if (this.get('barCount') == 1) {
        //info -> #4bb1cf -> rgba(75, 177, 207, 0.25)
        return 'rgba(75, 177, 207, 0.25)';
      } else if (this.get('barCount') % 2 == 0) {
        // success -> #5eb95e -> rgba(94, 185, 94, 0.25)
        return 'rgba(94, 185, 94, 0.25)';
      } else if (this.get('barCount') % 3 == 0) {
        // warning -> #faa732 -> rgba(250, 167, 50, 0.25)
        return 'rgba(250, 167, 50, 0.25)';
      }
        // } else if (this.get('barCount') % 4 == 0) {
        // danger -> #dd514c ->
        // return 'rgba(221, 81, 76, 0.25)';
        //}
    }
  }.property('barCount', 'barColor'),
  totalWidth: function() {
    return (parseInt(this.get('max')) / parseInt(this.get('maxTotal'))) * 100;
  }.property('max', 'maxTotal'),
  currentPercentage: function() {
    return (this.get('current') - this.get('min')) / (this.get('max') - this.get('min')) * 100;
  }.property('current', 'max', 'min'),
  currentPercentageWidth: function() {
    if (this.get('currentPercentage') > 100) {
      return 100;
    } else {
      return this.get('currentPercentage');
    }
  }.property('currentPercentage'),
  isLastBar: function() {
    return (this.get('barCount') == this.get('numberOfBars'));
  }.property('numberOfBars', 'barCount'),
  isFirstBar: function() {
    return (this.get('barCount') == 1);
  }.property('barCount'),
  containerStyles: function() {
    return 'width:' + this.get('totalWidth') + '%; ' +
      'float:left; ' +
      'height:8px; ' +
      'overflow:visible; ' +
      'background:' + this.get('progressBarBackground') + ';' +
      'position:relative; ' +
      'border-top-left-radius:0px; border-bottom-left-radius:0px;border-top-right-radius:0px; border-bottom-right-radius:0px; ';
      //((!this.get('isFirstBar') && !this.get('isLastBar'))?'border-top-left-radius:0px; border-bottom-left-radius:0px;border-top-right-radius:0px; border-bottom-right-radius:0px; ':'') +
      //((this.get('isFirstBar'))?'border-top-right-radius:0px; border-bottom-right-radius:0px; ':'') +
  }.property('totalWidth', 'progressBarBackground', 'isFirstBar'),
  barStyles: function() {
    return 'width:' + this.get('currentPercentageWidth') + '%; ' +
      'position:relative; ' +
      'height: 8px; ';
      //((this.get('isLastBar'))?'border-top-right-radius:4px; border-bottom-right-radius:4px; ':'') +
      //((this.get('isFirstBar'))?'border-top-left-radius:4px; border-bottom-left-radius:4px; ':'');
  }.property('currentPercentageWidth'),
  currentValueLeft: function() {
    if (this.get('currentPercentage') < 5) {
      return 0;
    } else {
      return 0;
    }
  }.property('currentPercentage'),
  isCurrentValueVisible: function() {
    return (this.get('currentPercentage') < 95);
  }.property('currentPercentage'),
  currentValueStyles: function() {
    if (this.get('isCurrentValueVisible')) {
      return 'position:absolute; right:0px; bottom:-17px; color:black; font-size:.8em;';
    } else {
      return 'position:absolute; left:0px; bottom:-17px; color:black; font-size:.8em;';
    }
  }.property('isCurrentValueVisible')
});


