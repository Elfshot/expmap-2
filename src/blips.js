import './hud.js';
import { getIcon, getRandomColor } from './utils';
import { regionsList as regionsInit } from './hud';
import * as L from 'leaflet';

const markers = [];
const regionColour = {};
let blipsData;

export default async function init() {
  if (markers) await clearBlips();
  const regions = [];
  blipsData = blipsData || await (await fetch('https://elfshot.github.io/expmapResources/Other%20stuff/Locations.json')).json();

  Object.keys(blipsData).forEach(region => {
    if (window.filterText && !region.toLowerCase().includes(window.filterText.toLowerCase())) return;
    if (window.filter && window.filter[0] && !window.filter.toString().toLowerCase().includes(region.toLowerCase())) return;
    const currRegion = blipsData[region];
    const colour = regionColour[region] || 
      function() { const colour = getRandomColor(); regionColour[region] = colour; return colour; }();
    
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
  window.regions = window.regions || regions;

  regionsInit();
}

export function clearBlips() {
  markers.forEach((marker) => {
    window.map.removeLayer(marker[0]);
  });
}