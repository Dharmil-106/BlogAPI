export function getInitial(name) {
  if (!name) return '?';
  return name.charAt(0).toUpperCase();
}
