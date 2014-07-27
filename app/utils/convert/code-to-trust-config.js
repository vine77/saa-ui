import TrustConfig from '../mappings/trust-config';

export default function(code) {
  if (typeof type === 'string') code = code.toLowerCase();
  switch (code) {
    case 'unknown':
    case 'n/a':
    case TrustConfig.TRUST_CONFIG_UNKNOWN:
    case TrustConfig.TRUST_CONFIG_UNKNOWN.toString():
      return 'unknown';
    case 'false':
    case TrustConfig.TRUST_CONFIG_FALSE:
    case TrustConfig.TRUST_CONFIG_FALSE.toString():
      return 'false';
    case 'true':
    case TrustConfig.TRUST_CONFIG_TRUE:
    case TrustConfig.TRUST_CONFIG_TRUE.toString():
      return 'true';
    default:
      return 'unknown';
  }
}
