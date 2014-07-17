import Ember from 'ember';
import operational from '../mappings/operational';

/**
 * Convert string representation of operational status to corresponding integer code
 *
 * @param {string} code A string representation of operational status
 * @return {number} The corresponding integer code for that operational status
 */
export default function(operational) {
  if (typeof operational === 'string') operational = operational.toLowerCase();
  switch (operational) {
    case operational.UNKNOWN:
    case operational.UNKNOWN.toString():
    case 'unknown':
    case 'n/a':
      return operational.UNKNOWN;
    case operational.ON:
    case operational.ON.toString():
    case 'on':
      return operational.ON;
    case operational.OFF:
    case operational.OFF.toString():
    case 'off':
      return operational.OFF;
    case operational.REBOOTING:
    case operational.REBOOTING.toString():
    case 'rebooting':
      return operational.REBOOTING;
    case operational.PAUSED:
    case operational.PAUSED.toString():
    case 'paused':
      return operational.PAUSED;
    case operational.SUSPENDED:
    case operational.SUSPENDED.toString():
    case 'suspended':
      return operational.SUSPENDED;
    case operational.LIVE_MIGRATING:
    case operational.LIVE_MIGRATING.toString():
    case 'live migrating':
      return operational.LIVE_MIGRATING;
    case operational.MIGRATING_RESIZING:
    case operational.MIGRATING_RESIZING.toString():
    case 'migrating resizing':
      return operational.MIGRATING_RESIZING;
    case operational.CONFIRMATION_NEEDED:
    case operational.CONFIRMATION_NEEDED.toString():
    case 'confirmation needed':
      return operational.CONFIRMATION_NEEDED;
    case operational.REVERTING:
    case operational.REVERTING.toString():
    case 'reverting':
      return operational.REVERTING;
    case operational.MIGRATION_BLOCKED:
    case operational.MIGRATION_BLOCKED.toString():
    case 'migration blocked':
      return operational.MIGRATION_BLOCKED;
    case operational.SHELVING:
    case operational.SHELVING.toString():
    case 'shelving':
      return operational.SHELVING;
    case operational.SHELVED:
    case operational.SHELVED.toString():
    case 'shelved':
      return operational.SHELVED;
    case operational.SHELVED_OFFLOADED:
    case operational.SHELVED_OFFLOADED.toString():
    case 'shelved offloaded':
      return operational.SHELVED_OFFLOADED;
    default:
      return operational.UNKNOWN;
  }
}
