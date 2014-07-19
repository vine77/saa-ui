import Ember from 'ember';
import operational from './../mappings/operational';

/**
 * Convert integer code of operational status to corresponding string representation
 *
 * @param {number} code A numerical code for operational status
 * @return {string} The corresponding string representation for that operational status
 */
export default function(code) {
  if (typeof code === 'string') code = code.toLowerCase();
  switch (code) {
    case operational.UNKNOWN:
    case operational.UNKNOWN.toString():
    case 'unknown':
    case 'n/a':
      return 'unknown';
    case operational.ON:
    case operational.ON.toString():
    case 'on':
      return 'on';
    case operational.OFF:
    case operational.OFF.toString():
    case 'off':
      return 'off';
    case operational.REBOOTING:
    case operational.REBOOTING.toString():
    case 'rebooting':
      return 'rebooting';
    case operational.PAUSED:
    case operational.PAUSED.toString():
    case 'paused':
      return 'paused';
    case operational.SUSPENDED:
    case operational.SUSPENDED.toString():
    case 'suspended':
      return 'suspended';
        case operational.LIVE_MIGRATING:
    case operational.LIVE_MIGRATING.toString():
    case 'live migrating':
      return 'live migrating';
    case operational.MIGRATING_RESIZING:
    case operational.MIGRATING_RESIZING.toString():
    case 'migrating resizing':
      return 'migrating resizing';
    case operational.CONFIRMATION_NEEDED:
    case operational.CONFIRMATION_NEEDED.toString():
    case 'confirmation needed':
      return 'confirmation needed';
    case operational.REVERTING:
    case operational.REVERTING.toString():
    case 'reverting':
      return 'reverting';
    case operational.MIGRATION_BLOCKED:
    case operational.MIGRATION_BLOCKED.toString():
    case 'migration blocked':
      return 'migration blocked';
    case operational.SHELVING:
    case operational.SHELVING.toString():
    case 'shelving':
      return 'shelving';
    case operational.SHELVED:
    case operational.SHELVED.toString():
    case 'shelved':
      return 'shelved';
    case operational.SHELVED_OFFLOADED:
    case operational.SHELVED_OFFLOADED.toString():
    case 'shelved offloaded':
      return 'shelved offloaded';
    default:
      return 'unknown';
  }
}
