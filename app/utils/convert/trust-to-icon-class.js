import Trust from '../mappings/trust';

/**
 * Convert trust status to corresponding icon class
 *
 * @param {number} code A numerical code for trust status
 * @return {string} The corresponding icon class (to be applied to an <i> tag)
 */
export default function(code) {
  if (typeof code === 'string') code = code.toLowerCase();
  switch (code) {
    case Trust.UNKNOWN:
    case Trust.UNKNOWN.toString():
      return 'icon-question-sign unknown';
    case Trust.UNTRUSTED:
    case Trust.UNTRUSTED.toString():
      return 'icon-unlock untrusted';
    case Trust.TRUSTED:
    case Trust.TRUSTED.toString():
      return 'icon-lock trusted';
    case Trust.UNREGISTERED:
    case Trust.UNREGISTERED.toString():
      return 'icon-unlock unregistered';
    default:
      return 'icon-question-sign';
  }
}
