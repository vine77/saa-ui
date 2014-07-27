export default function(value, minimum, maximum) {
  var percent = value / maximum;
  percent = Math.round(percent * 100);
  return percent;
}
