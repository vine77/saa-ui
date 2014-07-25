import Ember from 'ember';
import trustConfig from '../mappings/trust-config';

export default function(code) {
  if (typeof type === 'string') code = code.toLowerCase();
  switch (code) {
    case 'unknown':
    case 'n/a':
    case trustConfig.TRUST_CONFIG_UNKNOWN:
    case trustConfig.TRUST_CONFIG_UNKNOWN.toString():
      return 'unknown';
    case 'false':
    case trustConfig.TRUST_CONFIG_FALSE:
    case trustConfig.TRUST_CONFIG_FALSE.toString():
      return 'false';
    case 'true':
    case trustConfig.TRUST_CONFIG_TRUE:
    case trustConfig.TRUST_CONFIG_TRUE.toString():
      return 'true';
    default:
      return 'unknown';
  }
}
