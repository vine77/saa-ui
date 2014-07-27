/**
 * Convert a value to a color given the range of possible values
 *
 * @param {number} value The value to translate into a corresponding color
 * @param {number} minimum The minimum of the range of possible values
 * @param {number} maximum The maximum of the range of possible values
 * @param {number} warning The lower threshold for orange values
 * @param {number} danger The lower threshold for red values
 * @return {string} A CSS color string, e.g. 'hsl(60, 100%, 100%)'
 */
export default function(value, minimum, maximum, warning, danger) {
  var range, percentage, hue;
  if (typeof value !== 'number') {
    return null;
  } else if (typeof minimum === 'number' && typeof maximum === 'number' && typeof warning === 'undefined' && typeof danger === 'undefined') {
    range = maximum - minimum;
    percentage = value/range;
    // Hues of green through red are 120 through 0
    hue = -1 * (percentage * 120) + 120;
    return 'hsl(' + hue + ', 100%, 45%)';
  } else if (typeof minimum === 'number' && typeof maximum === 'number' && typeof warning === 'number' && typeof danger === 'number' && minimum <= warning && warning <= danger && danger <= maximum && value >= minimum && value <= maximum) {
    if (value <= warning) {
      // Hues of green through yellow are 120 through 60
      range = warning - minimum;
      percentage = value/range;
      hue = -1 * (percentage * 60) + 120;
    } else if (value <= danger) {
      // Hues of yellow through dark orange are 60 through 30
      range = danger - warning;
      percentage = (value - warning)/range;
      hue = -1 * (percentage * 30) + 60;
    } else {
      // Hues of dark orange through red orange are 30 through 0
      range = maximum - danger;
      percentage = (value - danger)/range;
      hue = -1 * (percentage * 30) + 30;
    }
    return 'hsl(' + hue + ', 100%, 45%)';
  } else {
    return null;
  }
}
