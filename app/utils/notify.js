import health from '../utils/mappings/health';
import priorityToType from '../utils/priority-to-type';

export default function(message, type, notifyTitle, sticky) {
  if (message.length > 600) message = message.substring(0, 600) + '... [truncated]';
  if (typeof type === 'undefined') type = health.WARNING;
  type = priorityToType(type);
  if (typeof message === 'undefined') {
    var prefix = (type === 'info' || type === 'error') ? 'An ' : 'A ';
    message = prefix + type + ' event occurred';
  }
  if (typeof notifyTitle === 'undefined' || !notifyTitle) {
    notifyTitle = type.capitalize();
  }
  new window.PNotify({
    title: notifyTitle,
    text: message,
    type: type,
    animate_speed: 200,
    buttons: {
      sticker: false
    },
    hide: (sticky) ? false : true
  });
}
