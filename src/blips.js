import './hud.js';
import { getIcon, getRandomColor } from './utils.js';
import * as L from 'leaflet';

const markers = [];

export default async function init() {
  const regions = [];
  const blipsData = await (await fetch('https://elfshot.github.io/expmapResources/Other%20stuff/Locations.json')).json();

  Object.keys(blipsData).forEach(region => {
    if (window.filter && !region.toLowerCase().includes(window.filter)) return;
    const currRegion = blipsData[region];
    //console.log(currRegion);
    const colour = getRandomColor();
    regions.push(region);
    currRegion.forEach((blip, index) => {
      const marker = [L.marker([blip[0][0], blip[0][1]], {
        icon: getIcon('https://elfshot.github.io/expmapResources/Other%20stuff/Images/maps/boost.png', 25, colour, 27),
      }).bindPopup(`
        <div>
          <h4><b>${region} #${index+1}</b></h4>
          <h5><b>Additional Info</b>: ${blip[1]}</h5>
          <img src="${blip[2]}" width="${window.innerWidth/3.5}" onclick="window.open('${blip[2]}').focus()">
          <p><b>Credit: ${blip[3]}</b></p>
        </div>
      `,{ maxHeight: 1000, maxWidth: 1000 }), region];
      marker[0].addTo(window.map);
      markers.push(marker);
    });
  });
  window.regions = regions;
}

export function clearBlips() {
  markers.forEach((marker) => {
    window.map.removeLayer(marker[0]);
  });
}

export function filterBlips(filter = '') {
  filter = filter.toLowerCase();
  markers.forEach((marker) => {
    if (!marker[1].toLowerCase().includes(filter)) window.map.removeLayer(marker[0]);
  });
  window.filter = filter;
  init();
}