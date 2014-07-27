import Health from '../mappings/health';

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
    case Health.UNKNOWN:
    case Health.UNKNOWN.toString():
      return Health.UNKNOWN;
    // Success
    case 'success':
    case 'good':
    case Health.SUCCESS:
    case Health.SUCCESS.toString():
      return Health.SUCCESS;
    // Info
    case 'info':
    case Health.INFO:
    case Health.INFO.toString():
      return Health.INFO;
    // Warning
    case 'warning':
    case Health.WARNING:
    case Health.WARNING.toString():
      return Health.WARNING;
    // Error
    case 'error':
    case 'danger':
    case 'important':
    case 'bad':
    case 'critical':
    case Health.ERROR:
    case Health.ERROR.toString():
    case Health.CRITICAL:
    case Health.CRITICAL.toString():
      return Health.ERROR;
    default:
      return null;
  }
}
