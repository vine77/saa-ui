import Ember from 'ember';
import health from '../mappings/health';

/**
 * Convert integer code of priority to corresponding string representation
 *
 * @param {number} priority A numerical code for priority level
 * @return {string} The corresponding string representation for that priority level: 'unknown', 'success', 'info', 'warning', or 'error'
 */
export default function(priority, good) {
  if (typeof priority === 'string') priority = priority.toLowerCase();
  switch (priority) {
    // Unknown
    case 'unknown':
    case 'n/a':
    case health.UNKNOWN:
    case health.UNKNOWN.toString():
      return 'unknown';
    // Success
    case 'success':
    case 'good':
    case health.SUCCESS:
    case health.SUCCESS.toString():
      return (good) ? 'good' : 'success';
    // Info
    case 'info':
    case health.INFO:
    case health.INFO.toString():
      return 'info';
    // Warning
    case 'warning':
    case health.WARNING:
    case health.WARNING.toString():
      return 'warning';
    // Error
    case 'error':
    case 'danger':
    case 'important':
    case 'bad':
    case 'critical':
    case health.ERROR:
    case health.ERROR.toString():
    case health.CRITICAL:
    case health.CRITICAL.toString():
      return 'error';
    default:
      return 'unknown';
  }
}
