import Ember from 'ember';
import trust from '../mappings/trust'

export default function(value) {
  switch (value) {
    case trust.UNKNOWN:
    case '0':
      return 'unknown';
    case trust.UNTRUSTED:
    case '1':
      return 'untrusted';
    case trust.TRUSTED:
    case '2':
      return 'trusted';
    case trust.UNREGISTERED:
    case '3':
      return 'unregistered';
    default:
      return 'n/a';
  }
}
