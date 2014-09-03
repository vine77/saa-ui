import Ember from 'ember';

export default function (number, digits) {
  if (isNaN(parseFloat(number))) {
    return null;
  } else {
    number = parseFloat(number);
  }
  if (digits === undefined) digits = 0;
  return number.toFixed(digits);
}
