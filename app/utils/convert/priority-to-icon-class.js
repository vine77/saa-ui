import Ember from 'ember';
import health from './../mappings/health';

/**
 * Convert priority to corresponding icon class
 *
 * @param {number} priority A numerical code for priority level (the corresponding string representation works too)
 * @return {string} The corresponding icon class (to be applied to an <i> tag)
 */
export default function(priority) {
  if (typeof priority === 'string') priority = priority.toLowerCase();
  switch (priority) {
    case health.UNKNOWN:
    case health.UNKNOWN.toString():
    case 'unknown':
    case 'n/a':
      return 'icon-question-sign';
    case health.SUCCESS:
    case health.SUCCESS.toString():
    case 'success':
    case 'good':
      return 'icon-ok';
    case health.INFO:
    case health.INFO.toString():
    case 'info':
      return 'icon-info-sign';
    case health.WARNING:
    case health.WARNING.toString():
    case 'warning':
      return 'icon-warning-sign';
    case health.ERROR:
    case health.ERROR.toString():
    case health.CRITICAL:
    case health.CRITICAL.toString():
    case 'error':
    case 'danger':
    case 'important':
    case 'bad':
    case 'critical':
      return 'icon-remove';
    default:
      return 'icon-question-sign';
  }
}
