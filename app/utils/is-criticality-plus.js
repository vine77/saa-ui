export default function(criticality) {
  criticality = (typeof criticality.get === 'function') ? criticality.get('label') : criticality.label;
  return (criticality.indexOf('+') > -1);
}
