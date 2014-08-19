import Mode from '../utils/mappings/health';

export default function(code) {
  if (typeof type === 'string') code = code.toLowerCase();
  switch (code) {
    case Mode.NON_SAM:
    case Mode.NON_SAM.toString():
      return 'Not Controlled';
    case Mode.ASSURED_SCU_VCPU:
    case Mode.ASSURED_SCU_VCPU.toString():
      return 'Assured SCU VCPU';
    case Mode.ASSURED_SCU_VM:
    case Mode.ASSURED_SCU_VM.toString():
      return 'Assured SCU VCPU';    
    case Mode.ASSURED_CORES_PHYSICAL:
    case Mode.ASSURED_CORES_PHYSICAL.toString():
      return 'Assured Physical Cores';
    default:
      return 'Unknown'
  }
}
