export default function(type) {
  if (typeof type === 'string') type = type.toLowerCase();
  switch(type) {
    case 'os':
      return 0;
    case '6wind':
      return 1;
    case 'vm':
      return 2;
  }
}
