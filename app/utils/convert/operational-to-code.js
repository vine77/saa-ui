import Operational from '../mappings/operational';

/**
 * Convert string representation of Operational status to corresponding integer code
 *
 * @param {string} code A string representation of Operational status
 * @return {number} The corresponding integer code for that Operational status
 */
export default function(operational) {
  if (typeof operational === 'string') operational = operational.toLowerCase();
  switch (operational) {
    case Operational.UNKNOWN:
    case Operational.UNKNOWN.toString():
    case 'unknown':
    case 'n/a':
      return Operational.UNKNOWN;
    case Operational.ON:
    case Operational.ON.toString():
    case 'on':
      return Operational.ON;
    case Operational.OFF:
    case Operational.OFF.toString():
    case 'off':
      return Operational.OFF;
    case Operational.REBOOTING:
    case Operational.REBOOTING.toString():
    case 'rebooting':
      return Operational.REBOOTING;
    case Operational.PAUSED:
    case Operational.PAUSED.toString():
    case 'paused':
      return Operational.PAUSED;
    case Operational.SUSPENDED:
    case Operational.SUSPENDED.toString():
    case 'suspended':
      return Operational.SUSPENDED;
    case Operational.LIVE_MIGRATING:
    case Operational.LIVE_MIGRATING.toString():
    case 'live migrating':
      return Operational.LIVE_MIGRATING;
    case Operational.MIGRATING_RESIZING:
    case Operational.MIGRATING_RESIZING.toString():
    case 'migrating resizing':
      return Operational.MIGRATING_RESIZING;
    case Operational.CONFIRMATION_NEEDED:
    case Operational.CONFIRMATION_NEEDED.toString():
    case 'confirmation needed':
      return Operational.CONFIRMATION_NEEDED;
    case Operational.REVERTING:
    case Operational.REVERTING.toString():
    case 'reverting':
      return Operational.REVERTING;
    case Operational.MIGRATION_BLOCKED:
    case Operational.MIGRATION_BLOCKED.toString():
    case 'migration blocked':
      return Operational.MIGRATION_BLOCKED;
    case Operational.SHELVING:
    case Operational.SHELVING.toString():
    case 'shelving':
      return Operational.SHELVING;
    case Operational.SHELVED:
    case Operational.SHELVED.toString():
    case 'shelved':
      return Operational.SHELVED;
    case Operational.SHELVED_OFFLOADED:
    case Operational.SHELVED_OFFLOADED.toString():
    case 'shelved offloaded':
      return Operational.SHELVED_OFFLOADED;
    default:
      return Operational.UNKNOWN;
  }
}
