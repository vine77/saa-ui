import Ember from 'ember';

export default Ember.ObjectController.extend({
  progressBarColors: ['progress-info', 'progress-success', 'progress-warning', 'progress-danger'],
  progressBarColor: function() {
    if (this.get('barCount') === 1) {
      return this.get('progressBarColors')[0];
    } else if (this.get('barCount') % 2 === 0) {
      return this.get('progressBarColors')[1];
    } else if (this.get('barCount') % 3 === 0) {
      return this.get('progressBarColors')[2];
    } else if (this.get('barCount') % 4 === 0) {
      return this.get('progressBarColors')[3];
    }
  }.property('progressBarColors', 'barCount'),
  progressBarBackground: function() {
   if (this.get('barCount') === 1) {
      //info -> #4bb1cf -> rgba(75, 177, 207, 0.25)
      return 'rgba(75, 177, 207, 0.25)';
    } else if (this.get('barCount') % 2 === 0) {
      // success -> #5eb95e -> rgba(94, 185, 94, 0.25)
      return 'rgba(94, 185, 94, 0.25)';
    } else if (this.get('barCount') % 3 === 0) {
      // warning -> #faa732 -> rgba(250, 167, 50, 0.25)
      return 'rgba(250, 167, 50, 0.25)';
    } else if (this.get('barCount') % 4 === 0) {
      // danger -> #dd514c ->
      return 'rgba(221, 81, 76, 0.25)';
    }
  }.property('barCount'),
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
    return (this.get('barCount') === this.get('numberOfBars'));
  }.property('numberOfBars', 'barCount'),
  isFirstBar: function() {
    return (this.get('barCount') === 1);
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
  }.property('isCurrentValueVisible'),
  currentValueToolTip: function() {
    return ((!Ember.isEmpty(this.get('title')))?'<strong>' + this.get('title') + '</strong> <br />':'') +
      this.get('current') + ' out of ' + this.get('max') + ' <br />' +
      ((!Ember.isEmpty(this.get('label')))?this.get('label'):'');

  }.property('current', 'max', 'title')

});
