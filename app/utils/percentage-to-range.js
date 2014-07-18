export default function(value, minimum, maximum) {
  percent = value / maximum;
  percent = Math.round(percent * 100);
  return percent;
}
