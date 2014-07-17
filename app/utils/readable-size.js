import bytesToReadableSize from './bytes-to-readable-size';

export default function(size) {
  if (typeof size === 'string') {
    // Assume backend is using historic units for customary binary prefixes
    var byteUnits = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    size = size.split(' ');
    if (size[1] && byteUnits.indexOf(size[1].toUpperCase()) !== -1) {
      var multiplier = Math.pow(1024, byteUnits.indexOf(size[1].toUpperCase()));
      var sizeBase = parseInt(size[0]);
      if (!window.isNaN(sizeBase)) {
        return bytesToReadableSize(sizeBase, multiplier);
      }
    }
  } else if (typeof size === 'number') {
    return bytesToReadableSize(size);
  }
}
