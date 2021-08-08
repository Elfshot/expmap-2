import * as L from 'leaflet';
import { default as playerTracker, clearTrails } from './player';
import { default as blipsInit } from './blips'; 
let currentLayer = null;
const mapLayerTypes = [['Color Map', 'images/maps/color-mode-tiles/{z}_{x}_{y}.jpg'], 
  ['Dark Map', 'images/maps/dark-mode-tiles/{z}_{x}_{y}.jpg']
];
window.serversList = [
  { ip: 'https://tycoon-w8r4q4.users.cfx.re', name: 'Server #1 (OneSync)' },
  { ip: 'https://tycoon-2epova.users.cfx.re', name: 'Server #2' },
  { ip: 'https://tycoon-2epovd.users.cfx.re', name: 'Server #3' },
  { ip: 'https://tycoon-wdrypd.users.cfx.re', name: 'Server #4' },
  { ip: 'https://tycoon-njyvop.users.cfx.re', name: 'Server #5 (Beta)' },
  { ip: 'https://tycoon-2r4588.users.cfx.re', name: 'Server #6' },
  { ip: 'https://tycoon-npl5oy.users.cfx.re', name: 'Server #7' },
  { ip: 'https://tycoon-2vzlde.users.cfx.re', name: 'Server #8' },
  { ip: 'https://tycoon-wmapod.users.cfx.re', name: 'Server #9' },
  { ip: 'https://tycoon-wxjpge.users.cfx.re', name: 'Server #A' },
  { ip: 'https://tycoon-2rkmr8.users.cfx.re', name: 'Server #B' },
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
let filter;
export function regionsList() {
  if (!filter || (window.filterText && window.filterText !== filter)) {
    while (regionsDiv.children.length > 0) regionsDiv.children[regionsDiv.children.length-1].remove();
    window.filterText = window.filterText || '';
    window.regions.forEach((region) => {
      if (window.filterText && !region.toLowerCase().includes(window.filterText.toLowerCase())) return;
      const row = document.createElement('div'); row.className = 'row';
      const btn = document.createElement('input'); btn.type = 'checkbox'; btn.value = region; 
      btn.onclick = () => { 
        btn.checked? window.filter.push(btn.value): window.filter.splice(window.filter.indexOf(btn.value),1);
        blipsInit();
      };
      const p = document.createElement('p'); p.innerText = region; 
      p.onclick = () => btn.click();
      row.appendChild(btn);
      row.appendChild(p);
      regionsDiv.appendChild(row);
    });

    filter = window.filterText || ' ';
  }
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

    optionsBlock.appendChild(row1);
    optionsBlock.appendChild(row2);
  }

  function tracker() {
    const trackerBlock = createSidebarBlock(hud, 'Tracker Options');
    const headings = ['Server:\n', 'Player ID\n', ''];
    const row1 = document.createElement('div');
    row1.className = 'row';
    row1.innerText = headings[0];
    const dropdown = document.createElement('select');
    //dropdown.type = 'text';
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
