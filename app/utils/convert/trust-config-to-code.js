import TrustConfig from '../mappings/trust-config';

export default function(string) {
  if (typeof type === 'string') string = string.toLowerCase();
  switch (string) {
    case 'unknown':
    case 'n/a':
    case TrustConfig.UNKNOWN:
    case TrustConfig.UNKNOWN.toString():
      return TrustConfig.UNKNOWN;
    case 'false':
    case TrustConfig.FALSE:
    case TrustConfig.FALSE.toString():
      return TrustConfig.FALSE;
    case 'true':
    case TrustConfig.TRUE:
    case TrustConfig.TRUE.toString():
      return TrustConfig.TRUE;
  }
}
