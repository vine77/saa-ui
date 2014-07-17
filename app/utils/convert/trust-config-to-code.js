import Ember from 'ember';
import trustConfig from '../mappings/trust-config';

export default function(trustConfig) {
  if (typeof type === 'string') code = code.toLowerCase();
  switch (trustConfig) {
    case 'unknown':
    case 'n/a':
    case trustConfig.UNKNOWN:
    case trustConfig.UNKNOWN.toString():
      return trustConfig.UNKNOWN;
    case 'false':
    case trustConfig.FALSE:
    case trustConfig.FALSE.toString():
      return trustConfig.FALSE;
    case 'true':
    case trustConfig.TRUE:
    case trustConfig.TRUE.toString():
      return trustConfig.TRUE;
  }
}
