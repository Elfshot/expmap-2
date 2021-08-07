import * as L from 'leaflet';
import { getIcon } from './utils';

let playerMarker; 
let trails = [];
let activeTO;

export function disableAPI() {
  try {
    document.getElementById('playerInputSearch').remove();
    document.getElementById('LocatePlayerButton').remove();
    document.getElementById('ServerSelector').remove();
  } catch { }
}

export default async function PlayerPos(pos) {
  const reqServer = document.getElementById('ServerSelector').value;
  const playerId = document.getElementById('playerInputSearch').value;
  try {
    if (!reqServer || !playerId) return alert('Provide the server and id dawhg');
    const mapData = await (await fetch(`https://vps-056c096a.vps.ovh.ca:5000/api/positions?server=${
      window.serversList.find((server) => server.name === reqServer).ip
    }${playerId ? `&vrpid=${playerId}` : ''}`)).json();
    //console.log(mapData);
    const playerData = [];
    if (!pos) {
      const player = mapData.find((players) => players[2].toString() === playerId);
      if (!player) return alert('Player not found!');
      console.log(player);
      playerData.push(player[3]['x']);
      playerData.push(player[3]['y']);
      playerData.push(player[6]);
    }
    if (playerMarker) window.map.removeLayer(playerMarker);
    const marker = L.marker([playerData[0], playerData[1]], {
      icon: getIcon('https://elfshot.github.io/expmapResources/Other%20stuff/Images/maps/monke.png', 30),
    });
    marker.addTo(window.map, { paddingTopLeft: [200, 350] });
    if (window.follow) window.map.flyTo(marker.getLatLng());
    playerMarker = marker;

    if (!pos) activeTO = setTimeout(() => PlayerPos(), 6000); // Use active TO to avoid spamming the button for better times

    if (pos) {
      // same thing w/o loop
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
//372890
//58376