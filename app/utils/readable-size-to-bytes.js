export default function(stringSize, decimalPrefix) {
  if (!stringSize) return null;
  var intSize = parseInt(stringSize);
  var inputUnits = stringSize.replace(intSize, '').trim().toUpperCase();
  var decimalUnits = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  var binaryUnits = ['B', 'KIB', 'MIB', 'GIB', 'TIB', 'PIB', 'EIB', 'ZIB', 'YIB'];
  if (decimalUnits.indexOf(inputUnits) !== -1) {
    var power = (typeof decimalPrefix === 'undefined') ? 1000 : (decimalPrefix ? 1000 : 1024);
    var multiplier = Math.pow(power, decimalUnits.indexOf(inputUnits));
    return intSize * multiplier;
  } else if (binaryUnits.indexOf(inputUnits) !== -1) {
    var power = (typeof decimalPrefix === 'undefined') ? 1024 : (decimalPrefix ? 1000 : 1024);
    var multiplier = Math.pow(power, binaryUnits.indexOf(inputUnits));
    return intSize * multiplier;
  } else {
    return null;
  }
}
