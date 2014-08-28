import Ember from 'ember';
import ProgressBarAdjacentController from '../controllers/progress-bar-adjacent';

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
export default Ember.Component.extend({
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
    i = 1;
    var maxTotal = 0;
    var min, max, current, label, title, color;
    while (i <= this.get('numberOfBars')) {
      max = this.get('barMax' + i);
      if (max) {
        maxTotal = parseInt(max) + parseInt(maxTotal);
      }
      i++;
    }
    this.set('maxTotal', maxTotal);
    var returnBars = [];
    i = 1;
    while (i <= this.get('numberOfBars')) {
      max = this.get('barMax' + i);
      min = this.get('barMin' + i);
      current = this.get('barValue' + i);
      label = this.get('barLabel' + i);
      title = this.get('barTitle' + i);
      color = this.get('barColor' + i);
      returnBars.push(
        ProgressBarAdjacentController.create({
          min: min,
          max: max,
          maxTotal: this.get('maxTotal'),
          current: current,
          numberOfBars: this.get('numberOfBars'),
          barCount: i,
          barColor: i,
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
  }.property('tooltip'),
  notifyBars: function() {
    this.notifyPropertyChange('bars');
  }
});
