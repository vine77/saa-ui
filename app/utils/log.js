export default function() {
  if (typeof(Storage) !== 'undefined') window.localStorage.log = window.localStorage.log || [];
  if (arguments.length === 1) {
    if (typeof(Storage) !== 'undefined') window.localStorage.log.push(arguments[0]);
    if (window.console) window.console.log(arguments[0]);
  } else if (arguments.length > 1) {
    if (typeof(Storage) !== 'undefined') window.localStorage.log.push(arguments);
    if (window.console) window.console.log(Array.prototype.slice.call(arguments));
  }
}
