import * as L from 'leaflet';
import { getIcon } from './utils';

let playerMarker; 
let trails = [];
let beforePos;
export function clearTrails() {
  trails.forEach((trail) => {
    window.map.removeLayer(trail);
  });
}

export function disableAPI() {
  try {
    document.getElementById('playerInputSearch').remove();
    document.getElementById('LocatePlayerButton').remove();
    document.getElementById('ServerSelector').remove();
  } catch { }
}

export default async function PlayerPos(pos) {
  try {
    const playerData = [];
    if (!pos) {
      const reqServer = document.getElementById('ServerSelector').value;
      const playerId = document.getElementById('playerInputSearch').value;
      if (!reqServer || !playerId) return alert('Provide the server and id dawhg');
      const mapData = await (await fetch(`https://vps-056c096a.vps.ovh.ca:5000/api/positions?server=${
        window.serversList.find((server) => server.name === reqServer).ip[1]
      }${playerId ? `&vrpid=${playerId}` : ''}`)).json();
      const player = mapData.find((players) => players[2].toString() === playerId);
      if (!player) return alert('Player not found!');
      playerData.push(player[3]['x']);
      playerData.push(player[3]['y']);
      playerData.push(player[6]);
    }
    if (pos) playerData.push(pos[0], pos[1]);
    if (playerMarker) window.map.removeLayer(playerMarker);
    const icon = getIcon('./images/maps/player.png', [30, 60]);
    icon.options.iconAnchor = [15,28];
    const marker = L.marker([playerData[0], playerData[1]], {
      icon,
    });
    marker.addTo(window.map, { paddingTopLeft: [200, 350] });
    if (window.follow) window.map.flyTo(marker.getLatLng());
    playerMarker = marker;

    if (!pos) window.activeTOPlayer = setTimeout(() => PlayerPos(), 6000); // Use active TO to avoid spamming the button for better times
    else window.activeTOPlayer = undefined;

    if (pos) {
      if (beforePos) {
        const latlang = [ [beforePos[0], beforePos[1]], [pos[0], pos[1]] ];
        const line = L.polyline(latlang, { color: 'red' }).addTo(window.map);
        trails.push(line);
      }
      beforePos = pos;
    } else {
      if (!playerData[2]) return;
      const latlang = [];
      playerData[2].forEach((pos) => {
        latlang.push([pos[1], pos[2]]); //because gta...
      });

      const line = L.polyline(latlang, { color: 'red' }).addTo(window.map);
      trails.push(line);
    }

  } catch(err) { console.log(err); }
}
window.usable = window.usable || {};
window.usable.players = PlayerPos;