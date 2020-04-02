// Shortcut of the dependencies
const { Map, View } = ol;
const TileLayer = ol.layer.Tile;
const OSM = ol.source.OSM;
const { fromLonLat } = ol.proj;
const Overlay = ol.Overlay;
const { Style, Stroke } = ol.style;
const VectorLayer = ol.layer.Vector;
const VectorSource = ol.source.Vector;
const KML = ol.format.KML;

const posMarker = fromLonLat([7.064229, 43.617235]);
const posCenter = fromLonLat([24.596220, 53.700813]);

const vecCache = {};
const nutsCache = {};
const nutsStack = [];

//const server_url = "http://localhost:8080";
const server_url = "http://192.168.137.1:8080";

const $ = e => document.querySelector(e);

window.onload = _ => listNuts();

async function listNuts(code = "", level = 0) {
    const idx = code + ":" + level;
    // If NUTS not in cache create new
    if (!nutsCache[idx]) {
        const buf = await fetch(`${server_url}/api/getNuts/${level}/${code}`);
        nutsCache[idx] = await buf.json();
    }

    updateTbody(nutsCache[idx]);
    nutsStack.push(nutsCache[idx]);
    console.log(nutsCache[idx]);
}

function updateTbody(nuts) {
    const tbody = $('table#listNuts tbody');
    tbody.innerHTML = "";
    const total = nuts.reduce((total, n) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${n.code}</td>
                        <td>${n.label}</td>
                        <td>${n.nb_subnut}</td>
                        <td><button onclick='addVec("${n.code}")'>Add</button></td>
                        <td><button onclick='listNuts("${n.code}", ${n.level+1})'>F</button></td>`;
        tr.onmouseenter = _ => addVec(n.code);
        tr.onmouseleave = _ => removeVec(n.code);
        tbody.append(tr);
        return total + n.nb_subnut;
    }, 0);
    $('td#totalNuts').innerHTML = nuts.length;
    $('td#totalSubNuts').innerHTML = total;
}

function backBtn() {
    if (nutsStack.length == 1) {
        alert('Déja à la racine !');
        return;
    }
    nutsStack.pop();
    updateTbody(nutsStack[nutsStack.length - 1]);
}

function removeVec(name) {
    map.removeLayer(vecCache[name]);
    for (let elt of $('table#listOverlay tbody').childNodes) {
        if (elt.id == name) {
            elt.remove();
            break;
        }
    }
}

function addVec(name) {
    // If VectorLayer not in cache create new
    if (!vecCache[name]) {
        vecCache[name] = new VectorLayer({
            source: new VectorSource({
                url: `${server_url}/api/getGeometry/${name}`,
                format: new KML({
                    extractStyles: false
                })
            }),
            style: feature => new Style({
                fill: new Stroke({
                    color: [255, 0, 0, 0.2]
                }),
                geometry: feature.get('geometry')
            })
        });
    }

    map.addLayer(vecCache[name]);
    $('table#listOverlay tbody').innerHTML += `<tr id="${name}"><td>${name}</td><td><button onclick="removeVec('${name}')">X</button></td></tr>`;
}

const map = new Map({
    target: 'map',
    layers: [
        new TileLayer({
            source: new OSM()
        })
    ],
    view: new View({
        center: posCenter,
        zoom: 4
    })
});

const marker = new Overlay({
    position: posMarker,
    positioning: 'center-center',
    element: document.getElementById('marker'),
    stopEvent: false
});
map.addOverlay(marker);

const brevetX = new Overlay({
    position: posMarker,
    element: document.getElementById('brevetX')
});
map.addOverlay(brevetX);