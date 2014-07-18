export default function(criticality) {
  var criticality = (typeof criticality.get === 'function') ? criticality.get('label') : criticality.label;
  return (criticality.indexOf('+') > -1);
}
