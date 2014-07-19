import Ember from 'ember';
import trust from './../mappings/trust';

/**
 * Convert trust status to corresponding icon class
 *
 * @param {number} code A numerical code for trust status
 * @return {string} The corresponding icon class (to be applied to an <i> tag)
 */
export default function(code) {
  if (typeof code === 'string') code = code.toLowerCase();
  switch (code) {
    case trust.UNKNOWN:
    case trust.UNKNOWN.toString():
      return 'icon-question-sign unknown';
    case trust.UNTRUSTED:
    case trust.UNTRUSTED.toString():
      return 'icon-unlock untrusted';
    case trust.TRUSTED:
    case trust.TRUSTED.toString():
      return 'icon-lock trusted';
    case trust.UNREGISTERED:
    case trust.UNREGISTERED.toString():
      return 'icon-unlock unregistered';
    default:
      return 'icon-question-sign';
  }
}
