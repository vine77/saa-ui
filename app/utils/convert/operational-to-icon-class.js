import Ember from 'ember';
import operational from './../mappings/operational';

/**
 * Convert operational status to corresponding icon class
 *
 * @param {number} code A numerical code for operational status (the corresponding string representation works too)
 * @return {string} The corresponding icon class (to be applied to an <i> tag)
 */
export default function(code) {
  if (typeof code === 'string') code = code.toLowerCase();
  switch (code) {
    case operational.UNKNOWN:
    case operational.UNKNOWN.toString():
    case 'unknown':
    case 'n/a':
      return 'icon-question-sign';
    case operational.ON:
    case operational.ON.toString():
    case 'on':
      return 'icon-bolt';
    case operational.OFF:
    case operational.OFF.toString():
    case 'off':
      return 'icon-off';
    case operational.REBOOTING:
    case operational.REBOOTING.toString():
    case 'rebooting':
      return 'icon-spinner icon-spin';
    case operational.PAUSED:
    case operational.PAUSED.toString():
    case 'paused':
      return 'icon-pause';
    case operational.SUSPENDED:
    case operational.SUSPENDED.toString():
    case 'suspended':
      return 'icon-pause';
    case operational.LIVE_MIGRATING:
    case operational.LIVE_MIGRATING.toString():
    case 'live migrating':
      return 'icon-truck icon-flip-horizontal blink-success';
    case operational.MIGRATING_RESIZING:
    case operational.MIGRATING_RESIZING.toString():
    case 'migrating resizing':
      return 'icon-truck icon-flip-horizontal blink-success';
    case operational.CONFIRMATION_NEEDED:
    case operational.CONFIRMATION_NEEDED.toString():
    case 'confirmation needed':
      return 'icon-comments';
    case operational.REVERTING:
    case operational.REVERTING.toString():
    case 'reverting':
      return 'icon-truck blink-warning';
    case operational.MIGRATION_BLOCKED:
    case operational.MIGRATION_BLOCKED.toString():
    case 'migration blocked':
      return 'icon-minus-sign';
    case operational.SHELVING:
    case operational.SHELVING.toString():
    case 'shelving':
      return 'icon-folder-close blink-success';
    case operational.SHELVED:
    case operational.SHELVED.toString():
    case 'shelved':
      return 'icon-folder-close';
    case operational.SHELVED_OFFLOADED:
    case operational.SHELVED_OFFLOADED.toString():
    case 'shelved offloaded':
      return 'icon-folder-open';
    default:
      return 'icon-question-sign';
  }
}
