import Ember from 'ember';

export default function(value, minimum, maximum) {
  var percentage = value/maximum;
  percentage = Math.round(percentage * 100);
  return percentage;
}
