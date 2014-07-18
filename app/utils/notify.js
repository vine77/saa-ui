import health from 'mappings/health';
import priorityToType from 'priority-to-type';

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
  // Display notification to screen
  Ember.$.pnotify({
    title: notifyTitle,
    text: message,
    type: type,
    sticker: false,
    animate_speed: 200,
    hide: (sticky) ? false : true
  });
}
