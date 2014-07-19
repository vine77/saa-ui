import isEmpty from './is-empty';

/**
 * Generic isEmpty detection and string handling
 */
export default function(value) {
  if (isEmpty(value)) {
    return 'N/A';
  } else {
    return value;
  }
}
