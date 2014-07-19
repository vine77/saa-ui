import notify from './notify';
import health from './mappings/health';
import priorityToType from './priority-to-type';

export default function(message, type, isNotify, title, sticky) {
  if (typeof type === 'undefined') type = health.WARNING;
  type = priorityToType(type);
  if (typeof message === 'undefined') {
    var prefix = (type === 'info' || type === 'error') ? 'An ' : 'A ';
    message = prefix + type + ' event occurred';
  }
  if (typeof isNotify === 'undefined' || isNotify === true) {
    var notifyTitle = (typeof title === 'undefined' || !title) ? null : title;
    notify(message, type, notifyTitle, sticky);
  }
}
