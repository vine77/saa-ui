import Ember from 'ember';
import Operational from '../mappings/Operational';

/**
 * Convert integer code of Operational status to corresponding string representation
 *
 * @param {number} code A numerical code for Operational status
 * @return {string} The corresponding string representation for that Operational status
 */
export default function(code) {
  if (typeof code === 'string') code = code.toLowerCase();
  switch (code) {
    case Operational.UNKNOWN:
    case Operational.UNKNOWN.toString():
    case 'unknown':
    case 'n/a':
      return 'unknown';
    case Operational.ON:
    case Operational.ON.toString():
    case 'on':
      return 'on';
    case Operational.OFF:
    case Operational.OFF.toString():
    case 'off':
      return 'off';
    case Operational.REBOOTING:
    case Operational.REBOOTING.toString():
    case 'rebooting':
      return 'rebooting';
    case Operational.PAUSED:
    case Operational.PAUSED.toString():
    case 'paused':
      return 'paused';
    case Operational.SUSPENDED:
    case Operational.SUSPENDED.toString():
    case 'suspended':
      return 'suspended';
        case Operational.LIVE_MIGRATING:
    case Operational.LIVE_MIGRATING.toString():
    case 'live migrating':
      return 'live migrating';
    case Operational.MIGRATING_RESIZING:
    case Operational.MIGRATING_RESIZING.toString():
    case 'migrating resizing':
      return 'migrating resizing';
    case Operational.CONFIRMATION_NEEDED:
    case Operational.CONFIRMATION_NEEDED.toString():
    case 'confirmation needed':
      return 'confirmation needed';
    case Operational.REVERTING:
    case Operational.REVERTING.toString():
    case 'reverting':
      return 'reverting';
    case Operational.MIGRATION_BLOCKED:
    case Operational.MIGRATION_BLOCKED.toString():
    case 'migration blocked':
      return 'migration blocked';
    case Operational.SHELVING:
    case Operational.SHELVING.toString():
    case 'shelving':
      return 'shelving';
    case Operational.SHELVED:
    case Operational.SHELVED.toString():
    case 'shelved':
      return 'shelved';
    case Operational.SHELVED_OFFLOADED:
    case Operational.SHELVED_OFFLOADED.toString():
    case 'shelved offloaded':
      return 'shelved offloaded';
    default:
      return 'unknown';
  }
}
