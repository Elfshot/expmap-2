const colors = [
  'https://discord.com/assets/6278365424fa5701d3b185e2d9fe8225.svg',
  'https://discord.com/assets/a0a7f6cf67b863940eceaa40397e2030.svg',
  'https://discord.com/assets/35fce59c5d17a56d69c3de3d8864ed22.svg',
  'https://discord.com/assets/89266863a0183fbdd7b4524634f5ec8b.svg',
  'https://discord.com/assets/b633d391ab0f467ac71a7b459fefa4be.svg',
  'https://discord.com/assets/dbd26c4768e6ce541f5b857b4973226e.svg',
  'https://discord.com/assets/d5705ac7e416d39813ddf63c8d396102.svg',
  'https://discord.com/assets/4e697e73dee47d6a399f3d33d15a83b5.svg',
];

export function getRandomColor() {
  return colors[Math.floor(Math.random() * colors.length)];
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
