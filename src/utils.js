const colors = [
  'blue', 'brown', 'green', 'grey', 'orange', 'purple', 'red', 'yellow'
];
export function getRandomColor() {
  return `images/emotes/${colors[Math.floor(Math.random() * colors.length)]}.svg`;
}

export function getIcon(url, size, shawdowUrl, shadowsize) {
  const icon = L.icon({
    iconUrl: url,
    iconSize: size,
    iconAnchor: [20, 3],
    popupAnchor: [0, 0],
    shadowUrl: shawdowUrl,
    shadowSize: [shadowsize, shadowsize],
    shadowAnchor: [20, 5],
  });
  return icon;
}
