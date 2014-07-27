import Health from '../mappings/health';
import codeToOperational from './code-to-operational';
import priorityToType from './priority-to-type';

export default function(health, operational) {
  if (health === Health.SUCCESS) {
    return codeToOperational(operational);
  } else {
    return priorityToType(health);
  }
}
