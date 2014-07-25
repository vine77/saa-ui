import Ember from 'ember';
import health from '../mappings/health';

/**
 * Convert string representation of priority to corresponding integer codes
 *
 * @param {string} type A string representing priority level: 'unknown', 'success', 'warning', or 'error'
 * @return {number} The corresponding numerical code for that priority level
 */
export default function(type) {
  if (typeof type === 'string') type = type.toLowerCase();
  switch (type) {
    // Unknown
    case 'unknown':
    case 'n/a':
    case health.UNKNOWN:
    case health.UNKNOWN.toString():
      return health.UNKNOWN;
    // Success
    case 'success':
    case 'good':
    case health.SUCCESS:
    case health.SUCCESS.toString():
      return health.SUCCESS;
    // Info
    case 'info':
    case health.INFO:
    case health.INFO.toString():
      return health.INFO;
    // Warning
    case 'warning':
    case health.WARNING:
    case health.WARNING.toString():
      return health.WARNING;
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
      return health.ERROR;
    default:
      return null;
  }
}
