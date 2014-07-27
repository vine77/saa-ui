import Health from '../mappings/health';

/**
 * Convert priority to corresponding icon class
 *
 * @param {number} priority A numerical code for priority level (the corresponding string representation works too)
 * @return {string} The corresponding icon class (to be applied to an <i> tag)
 */
export default function(priority) {
  if (typeof priority === 'string') priority = priority.toLowerCase();
  switch (priority) {
    case Health.UNKNOWN:
    case Health.UNKNOWN.toString():
    case 'unknown':
    case 'n/a':
      return 'icon-question-sign';
    case Health.SUCCESS:
    case Health.SUCCESS.toString():
    case 'success':
    case 'good':
      return 'icon-ok';
    case Health.INFO:
    case Health.INFO.toString():
    case 'info':
      return 'icon-info-sign';
    case Health.WARNING:
    case Health.WARNING.toString():
    case 'warning':
      return 'icon-warning-sign';
    case Health.ERROR:
    case Health.ERROR.toString():
    case Health.CRITICAL:
    case Health.CRITICAL.toString():
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
