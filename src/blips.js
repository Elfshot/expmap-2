import './hud.js';
import { getIcon, getRandomColor } from './utils';
import { regionsList as regionsInit } from './hud';
import * as L from 'leaflet';

const markers = [];
const regionColour = {};
const specialMarkers = [];
let blipsData = localStorage.getItem('blipsData') !== 'undefined' ? JSON.parse(localStorage.getItem('blipsData')): undefined;
const customMarks = [[ -505.55902099609375, -197.5861053466797, 'https://elfshot.github.io/expmapResources/Other%20stuff/Images/maps/monke.png'],
];

window.filter = window.filter || [];

export default async function init() {
  if (markers) await clearBlips();
  const regions = [];
  if (!blipsData) {
    blipsData = await (await fetch('https://elfshot.github.io/expmapResources/Other%20stuff/Locations.json')).json();
    localStorage.setItem('blipsData',JSON.stringify(blipsData));
  }
  if (!window.blipsData) window.blipsData = blipsData;
  const blipsDataKeys = Object.keys(blipsData);
  
  let lastIndex;
  for (let i = blipsDataKeys.length -1; i >= 0; i--) {
    if (blipsDataKeys[i].toLowerCase().includes(window?.filter[0]?.toLowerCase() || window?.filterText?.toLowerCase())) {
      lastIndex = i;
    }
  }
  blipsDataKeys.forEach((region, indexKeys) => {
    if (window.filterText && !region.toLowerCase().includes(window.filterText.toLowerCase())) return;
    if (window.filter[0] && !window.filter.toString().toLowerCase().includes(region.toLowerCase())) return;
    const currRegion = blipsData[region];
    const colour = regionColour[region] || 
      function() { const colour = getRandomColor(); regionColour[region] = colour; return colour; }();
    
    regions.push(region);
    currRegion.forEach((blip, index) => {
      const popup = document.createElement('div');
      const innerDiv = document.createElement('div');
      innerDiv.innerHTML = `
        <h4><b>${region}-${index+1}</b></h4>
        <h5><b>Additional Info</b>: ${blip[1]}</h5>
        <img src="${blip[2]}" width="${window.innerWidth/3.5}" onclick="window.open('${blip[2]}').focus()">
        <p><b>Credit: ${blip[3]}</b></p>
        ${window.usable.popupButton? 
    `<input type="button" value="Set Waypoint" onclick="window.usable.popupButton(${
      blip[0][0]},${blip[0][1]})">`: ''}
        `;
      popup.appendChild(innerDiv);
      const marker = [L.marker([blip[0][0], blip[0][1]], {
        icon: getIcon('https://elfshot.github.io/expmapResources/Other%20stuff/Images/maps/boost.png', [25,25], colour, 27),
      }).bindPopup(popup, { maxHeight: 1000, maxWidth: 1000 }), region];
      marker[0].addTo(window.map);
      markers.push(marker);
      if((index === currRegion.length -1 && ( lastIndex !== -1 && lastIndex === indexKeys) && window.followM) && (window.filter[0] || window.filterText)) {
        window.map.flyToBounds(
          [marker[0].getLatLng(),marker[0].getLatLng()],{
            maxZoom: 5,
            duration: 0.5,
            paddingTopLeft: [-300, -50]
          });}
    });
  });
  window.regions = regions;
  customMarks.forEach((coords) => {
    const marker = L.marker([coords[0], coords[1]], {
      icon: getIcon(coords[2], [25,25]),
    });
    marker.addTo(window.map);
    specialMarkers.push(marker);
  });
  if ((window.regions.length === 0 || (!window.filterText && !window.filter[0])) && !window.follow) {
    window.map.flyToBounds(
      [specialMarkers[0].getLatLng(),specialMarkers[0].getLatLng()],{
        maxZoom: 5,
        duration: 0.5,
        paddingTopLeft: [-300, -50]
      });
  } 
  regionsInit();
}

export function clearBlips() {
  markers.forEach((marker) => {
    window.map.removeLayer(marker[0]);
  });
  specialMarkers.forEach((marker) => {
    window.map.removeLayer(marker);
  });
}

window.usable = window.usable || {};
window.usable.popupButton = undefined;
window.usable.blips = init;