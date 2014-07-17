export default function() {
  return '//' + window.location.host + window.location.pathname.split('/').slice(0, -1).join('/');
}
