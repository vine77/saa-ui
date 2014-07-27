import Health from '../mappings/health';

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
    case Health.UNKNOWN:
    case Health.UNKNOWN.toString():
      return 'unknown';
    // Success
    case 'success':
    case 'good':
    case Health.SUCCESS:
    case Health.SUCCESS.toString():
      return (good) ? 'good' : 'success';
    // Info
    case 'info':
    case Health.INFO:
    case Health.INFO.toString():
      return 'info';
    // Warning
    case 'warning':
    case Health.WARNING:
    case Health.WARNING.toString():
      return 'warning';
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
      return 'error';
    default:
      return 'unknown';
  }
}
