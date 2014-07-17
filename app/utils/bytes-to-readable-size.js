import Ember from 'ember';

export default function(sizeInBytes, multiplier, decimalPrefix) {
  if (typeof sizeInBytes !== 'number') sizeInBytes = parseInt(sizeInBytes);
  if (!window.isNaN(sizeInBytes) && !Ember.isEmpty(sizeInBytes)) {
    if (multiplier !== undefined) {
      sizeInBytes = sizeInBytes * multiplier;
    }
    if (sizeInBytes < 0) {
      return;
    } else if (sizeInBytes === 0) {
      return '0';
    }
    // Default to binary/IEC prefixes rather than decimal/SI prefixes
    var byteUnits = (decimalPrefix) ? ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']: ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    var power = (decimalPrefix) ? 1000 : 1024;
    var i = 0;
    while (sizeInBytes >= power) {
      sizeInBytes = sizeInBytes / power;
      i++;
    }
    return Math.max(sizeInBytes, 0.1).toFixed(1) + ' ' + byteUnits[i];
  }
}
