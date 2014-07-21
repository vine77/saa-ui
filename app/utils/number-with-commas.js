import Ember from 'ember';

export default function(number) {
  if (number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
}