import Ember from 'ember';

/**
 * Sort two inputs
 *
 * @param {string|number|boolean} a
 * @param {string|number|boolean} b
 * @returns {number} -1 if a < b, 0 if a == b, or 1 if a > b
 */
export default function(a, b) {
  // Sort undefined/null as less than non-undefined/non-null
  if (a === undefined || a === null) {
    return (b === undefined || b === null) ? 0 : -1;
  } else if (b === undefined || b === null) {
    return 1;
  }
  return window.naturalSort(a, b);
}
