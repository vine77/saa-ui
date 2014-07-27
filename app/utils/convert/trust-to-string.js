import Trust from '../mappings/trust';

export default function(value) {
  switch (value) {
    case Trust.UNKNOWN:
    case '0':
      return 'unknown';
    case Trust.UNTRUSTED:
    case '1':
      return 'untrusted';
    case Trust.TRUSTED:
    case '2':
      return 'trusted';
    case Trust.UNREGISTERED:
    case '3':
      return 'unregistered';
    default:
      return 'n/a';
  }
}
