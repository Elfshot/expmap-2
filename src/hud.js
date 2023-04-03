import * as L from 'leaflet';
import playerTracker, { clearTrails } from './player';
import { default as blipsInit } from './blips'; 
let currentLayer = null;
const mapLayerTypes = [['Color Map', 'images/maps/color-mode-tiles/{z}_{x}_{y}.jpg'], 
  ['Dark Map', 'images/maps/dark-mode-tiles/{z}_{x}_{y}.jpg']
];

window.serversList = [
  { ip: 'http://v1.api.tycoon.community/main', name: 'Server #1' },
  { ip: 'http://v1.api.tycoon.community/beta', name: 'Server #2 (Beta)' },
];

function changeTileLayer(newLayer) {
  const layer = L.tileLayer(newLayer, {
    tileSize: 288,
    nativeZooms: [3,4,5,6,7],
    noWrap: true,
    bounds: [{ lat: -6566, lng: -4735 }, { lat: 7166, lng: 8906 }],
    reuseTiles : true
  });
  if (currentLayer) map.removeLayer(currentLayer);
  layer.addTo(window.map);
  currentLayer = layer;
}

const hud = document.getElementById('sidebar');
const regionsBlock = createSidebarBlock(hud, 'Regions');
const regionsDiv = regionsBlock.appendChild(document.createElement('div'));
export function regionsList() {
  window.filter = window.filter || [];
  if (regionsDiv?.children?.length > 0) {
    for (let i = 0; regionsDiv.children.length+1 !== window.filter.length;) {
      try {
        if ((window.filterText && !regionsDiv.children[i].innerText.includes(window.filterText)) ||
          (window.filter && !window.filter.find(ele => ele.replace(/ /g,'') === regionsDiv.children[i].innerText.replace(/ /g,'')))) {
          regionsDiv.children[i].remove();
        } else i++;
      } catch { break; }
    }
  }

  window.filterText = window.filterText || '';
  window.regions.forEach((region) => {
    if (window.filterText && !region.toLowerCase().includes(window.filterText.toLowerCase())) return;
    if (window.filter[0] && window.filter.includes(regionsDiv.innerText)) return;
    const row = document.createElement('div'); row.className = 'row';
    const btn = document.createElement('input'); btn.type = 'checkbox'; btn.value = region; 
    btn.onclick = () => { 
      btn.checked? window.filter.push(btn.value): window.filter.splice(0,window.filter.length);
      blipsInit();
    };
    const p = document.createElement('p'); p.innerText = region; 
    p.onclick = () => btn.click();
    row.appendChild(btn);
    row.appendChild(p);
    regionsDiv.appendChild(row);
  });

}

export default function init() {
  
  function regionsSearch() {
    const row = document.createElement('div');
    row.className = 'row';
    const search = document.createElement('input');
    search.placeholder = 'Search a Region'; search.type = 'text'; search.onkeyup = () => {
      /*if (search.value.length < window.filterText.length)*/ window.filter = [];
      window.filterText = search.value;
      blipsInit();
    };
    row.appendChild(search);
    regionsBlock.prepend(row);
  }

  function options() {
    const optionsBlock = createSidebarBlock(hud, 'Map Options');
    const row1 = document.createElement('div');
    row1.className = 'row';
    row1.innerText = 'Select Map: ';
    mapLayerTypes.forEach((type) => { 
      const btn = document.createElement('input');
      btn.type = 'button';
      btn.value = type[0];
      btn.onclick = () => { changeTileLayer(type[1]); };
      row1.appendChild(btn);
    });

    const row2 = document.createElement('div'); row2.className = 'row'; row2.innerText = 'Clear lines: ';
    const r2btn = document.createElement('input'); r2btn.type = 'button'; r2btn.value = 'Clear';
    r2btn.onclick = () => clearTrails(); row2.appendChild(r2btn);

    window.followM = window.followM || true;
    const row3 = document.createElement('div');
    const markerTracker = document.createElement('input');
    markerTracker.type = 'checkbox'; markerTracker.checked = true;
    markerTracker.onclick = () => { markerTracker.checked = markerTracker.checked; window.followM = markerTracker.checked; };
    row3.innerText = 'Track Markers';
    row3.prepend(markerTracker);

    optionsBlock.appendChild(row1);
    optionsBlock.appendChild(row2);
    optionsBlock.appendChild(row3);
  }

  function tracker() {
    const trackerBlock = createSidebarBlock(hud, 'Tracker Options');
    const headings = ['Server:\n', 'Player ID\n', ''];
    const row1 = document.createElement('div');
    row1.className = 'row';
    row1.innerText = headings[0];
    const dropdown = document.createElement('select');
    dropdown.name = 'ServerSelector'; dropdown.id = 'ServerSelector';
    window.serversList.forEach((server) => {
      const option = document.createElement('option');
      option.text = server.name; dropdown.add(option, 1);
    });
    row1.appendChild(dropdown);
    
    const row2 = document.createElement('div');
    row2.className = 'row';
    row2.innerText = headings[1];
    const playerInput = document.createElement('input');
    playerInput.type = 'text'; playerInput.value = ''; playerInput.id = 'playerInputSearch'; playerInput.placeholder = 'Enter VrpId';
    row2.appendChild(playerInput);

    const row3 = document.createElement('div');
    const followerCheck = document.createElement('input');
    followerCheck.type = 'checkbox'; followerCheck.checked = false;
    followerCheck.onclick = () => { followerCheck.checked = followerCheck.checked; window.follow = followerCheck.checked; };
    const text = document.createElement('p'); row3.innerText = 'Follow player';
    row3.prepend(followerCheck);

    const row4 = document.createElement('div');
    const locatePlyerBtn = document.createElement('input');
    locatePlyerBtn.type = 'button'; locatePlyerBtn.value = 'Locate Player'; locatePlyerBtn.id = 'LocatePlayerButton'; 
    locatePlyerBtn.onclick = () => playerTracker();
    row4.appendChild(locatePlyerBtn);

    trackerBlock.appendChild(row1);
    trackerBlock.appendChild(row2);
    trackerBlock.appendChild(row3);
    trackerBlock.appendChild(row4);
    hud.appendChild(trackerBlock);
  }

  function credits() {
  
  }

  function scripts() {

  }
  options();
  tracker();
  regionsSearch();
}

function createSidebarBlock(domSidebar, text, enabled = false){
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = true;

  const block = document.createElement('div');
  block.className = 'sidebarBlock';

  const blockHeader = document.createElement('div');
  blockHeader.className = 'head';
  blockHeader.innerText = text;

  const contentBlock = document.createElement('div');
  contentBlock.className = text;

  if(!enabled){
    toggleContentBlock(checkbox, contentBlock);
  }

  blockHeader.onclick = () => toggleContentBlock(checkbox, contentBlock);

  blockHeader.prepend(checkbox);
  block.appendChild(blockHeader);
  block.appendChild(contentBlock);
  domSidebar.appendChild(block);

  contentBlock.id = text + 'ctxbx';
  return contentBlock;
}

function toggleElementDisplay(element){
  element.style.display = element.style.display === 'none' ? 'block' : 'none';
}

function toggleSidebar(checkbox, element){
  const enabled = element.style.display === 'none';
  element.style.display = enabled ? 'block' : 'none';
  checkbox.checked = enabled;
}

function toggleContentBlock(checkbox, element){
  checkbox.checked = element.hidden;
  element.hidden = !element.hidden;
}
window.usable = window.usable || {};
window.usable.createSidebarBlock = createSidebarBlock;
