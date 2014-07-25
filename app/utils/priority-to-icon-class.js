import health from '../utils/mappings/health';

export default function(priority) {
  if (typeof priority === 'string') priority = priority.toLowerCase();
  switch (priority) {
    case health.UNKNOWN:
    case health.UNKNOWN.toString():
    case 'unknown':
    case 'n/a':
      return 'fa fa-question-circle text-muted';
    case health.SUCCESS:
    case health.SUCCESS.toString():
    case 'success':
    case 'good':
      return 'fa fa-check-square-o text-success';
    case health.INFO:
    case health.INFO.toString():
    case 'info':
      return 'fa fa-info-circle text-primary';
    case health.WARNING:
    case health.WARNING.toString():
    case 'warning':
      return 'fa fa-exclamation-triangle text-warning';
    case health.ERROR:
    case health.ERROR.toString():
    case health.CRITICAL:
    case health.CRITICAL.toString():
    case 'error':
    case 'danger':
    case 'important':
    case 'bad':
    case 'critical':
      return 'fa fa-times-circle text-danger';
    default:
      return 'fa fa-question-circle';
  }
}
