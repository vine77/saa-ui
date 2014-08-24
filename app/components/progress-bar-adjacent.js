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
  numberOfBars: function() {
    var i = 1;
    var barCount = 0;
    while (i > barCount) {
      if (this.get('barMax' + i)) {
        i++;
        barCount++;
      } else {
        i--;
      }
    }
    return barCount;
  }.property(),
  maxTotal: 0,
  styleBinding: 'width:30px;',
  classNames: ['progress-bar-adjacent-container'],
  bars: function() {
    // Get the max total
    var i = 1;
    var min, max, current, label, title;
    while (i <= this.get('numberOfBars')) {
      max = this.get('barMax' + i);
      this.set('maxTotal', parseInt(this.get('maxTotal')) + parseInt(max));
      i++;
    }
    var returnBars = [];
    i = 1;
    while (i <= this.get('numberOfBars')) {
      max = this.get('barMax' + i);
      min = this.get('barMin' + i);
      current = this.get('barValue' + i);
      label = this.get('barLabel' + i);
      title = this.get('barTitle' + i);
      returnBars.push(
        ProgressBarAdjacentController.create({
          min: min,
          max: max,
          maxTotal: this.get('maxTotal'),
          current: current,
          numberOfBars: this.get('numberOfBars'),
          barCount: i,
          label: label,
          title: title
        })
      );
      this.addObserver('barValue' + i, this, this.notifyBars);
      this.addObserver('barLabel' + i, this, this.notifyBars);
      this.addObserver('barTitle' + i, this, this.notifyBars);
      this.addObserver('barMin' + i, this, this.notifyBars);
      this.addObserver('barMax' + i, this, this.notifyBars);
      i++;
    }
    return returnBars;
  }.property('numberOfBars'),
  notifyBars: function() {
    this.notifyPropertyChange('bars');
  }
});
