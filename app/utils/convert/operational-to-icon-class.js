import Ember from 'ember';
import Operational from '../mappings/Operational';

/**
 * Convert Operational status to corresponding icon class
 *
 * @param {number} code A numerical code for Operational status (the corresponding string representation works too)
 * @return {string} The corresponding icon class (to be applied to an <i> tag)
 */
export default function(code) {
  if (typeof code === 'string') code = code.toLowerCase();
  switch (code) {
    case Operational.UNKNOWN:
    case Operational.UNKNOWN.toString():
    case 'unknown':
    case 'n/a':
      return 'icon-question-sign';
    case Operational.ON:
    case Operational.ON.toString():
    case 'on':
      return 'icon-bolt';
    case Operational.OFF:
    case Operational.OFF.toString():
    case 'off':
      return 'icon-off';
    case Operational.REBOOTING:
    case Operational.REBOOTING.toString():
    case 'rebooting':
      return 'icon-spinner icon-spin';
    case Operational.PAUSED:
    case Operational.PAUSED.toString():
    case 'paused':
      return 'icon-pause';
    case Operational.SUSPENDED:
    case Operational.SUSPENDED.toString():
    case 'suspended':
      return 'icon-pause';
    case Operational.LIVE_MIGRATING:
    case Operational.LIVE_MIGRATING.toString():
    case 'live migrating':
      return 'icon-truck icon-flip-horizontal blink-success';
    case Operational.MIGRATING_RESIZING:
    case Operational.MIGRATING_RESIZING.toString():
    case 'migrating resizing':
      return 'icon-truck icon-flip-horizontal blink-success';
    case Operational.CONFIRMATION_NEEDED:
    case Operational.CONFIRMATION_NEEDED.toString():
    case 'confirmation needed':
      return 'icon-comments';
    case Operational.REVERTING:
    case Operational.REVERTING.toString():
    case 'reverting':
      return 'icon-truck blink-warning';
    case Operational.MIGRATION_BLOCKED:
    case Operational.MIGRATION_BLOCKED.toString():
    case 'migration blocked':
      return 'icon-minus-sign';
    case Operational.SHELVING:
    case Operational.SHELVING.toString():
    case 'shelving':
      return 'icon-folder-close blink-success';
    case Operational.SHELVED:
    case Operational.SHELVED.toString():
    case 'shelved':
      return 'icon-folder-close';
    case Operational.SHELVED_OFFLOADED:
    case Operational.SHELVED_OFFLOADED.toString():
    case 'shelved offloaded':
      return 'icon-folder-open';
    default:
      return 'icon-question-sign';
  }
}
