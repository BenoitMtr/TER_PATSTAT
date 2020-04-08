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
const Select = ol.interaction.Select;
const click = ol.events.conditions;

const vecCache = {};
const nutsCache = {};
const nutsStack = [];
//peut être utile par la suite, pour le moment on le remplit juste de tous les brevets de tous les nuts
//et on utilise ça pour afficher le nombre de brevets
const brevetsCache = {};

let brevetVisibles = false;

const server_url = "http://localhost:8080";
//const server_url = "http://192.168.137.1:8080";

const $ = e => document.querySelector(e);

window.onload = _ => {
    $('table#listNuts tfoot tr td button').onclick = _ => backBtn();
    $('table#listBrevets tfoot tr td button').onclick = _ => backBtn();
    listNuts();
};

async function listNuts(code = "", level = 0) {
    const idx = code + ":" + level;
    // If NUTS not in cache create new
    if (!nutsCache[idx]) {
        const buf = await fetch(`${server_url}/api/getNuts/${level}/${code}`);
        nutsCache[idx] = await buf.json();
    }

    getNbBrevets(idx);
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
                        <td><button>Add</button></td>
                        <td><button>F</button></td>
						<td><label>${brevetsCache[n.code].length}</label></td>
				        <td><button>Liste de brevets</button></td>`;
        tr.children[4].onclick = _ => listNuts(n.code, n.level + 1);
        tr.children[6].children[0].onclick = _ => displayListBrevets(brevetsCache[n.code]);
        if (n.has_gps) {
            tr.children[3].onclick = _ => addVec(n.code);
            tr.children[4].onclick = _ => listNuts(n.code);
            tr.onmouseenter = _ => addVec(n.code);
            tr.onmouseleave = _ => removeVec(n.code);
        } else {
            tr.children[3].onclick = _ => alert("No gps for this NUTS");
            tr.style.backgroundColor = '#FF000033';
        }
        tbody.append(tr);
        return total + n.nb_subnut;
    }, 0);
    $('td#totalNuts').innerHTML = nuts.length;
    $('td#totalSubNuts').innerHTML = total;
}

function backBtn() {
    if (brevetVisibles) {
        brevetVisibles = false;
        $('table#listNuts').style.visibility = 'visible';
        $('table#listBrevets').style.visibility = 'hidden';
        return;
    }

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

async function getNbBrevets(idx) {
    await Promise.all(nutsCache[idx].reduce((t, nuts) => {
        t.push(new Promise(async (resolve, _) => {
            if (!brevetsCache[nuts.code]) {
                const buf = await fetch(`${server_url}/api/getBrevets/${nuts.code}`);
                const bvt = await buf.json();
                brevetsCache[nuts.code] = bvt;
            }
            console.log(brevetsCache[nuts.code]);
            resolve();
        }));
        return t;
    }, []));
    updateTbody(nutsCache[idx]);
}

function displayListBrevets(liste) {
    console.log("liste: " + liste);
    brevetVisibles = true;
    $('table#listNuts').style.visibility = 'hidden';
    $('table#listBrevets').style.visibility = 'visible';
    const tbody = $('table#listBrevets tbody');
    tbody.innerHTML = "";
    liste.forEach(n => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${n.appln_id}</td>
                            <td>${n.person_name}</td>
                            <td>${n.appln_title}</td>
                            <td>${n.appln_filing_date}</td>`;
        tbody.append(tr);
    });
}

const posMarker = fromLonLat([7.064229, 43.617235]);
const posCenter = fromLonLat([24.596220, 53.700813]);

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
    element: $('div#marker'),
    stopEvent: false
});
map.addOverlay(marker);

const brevetX = new Overlay({
    position: posMarker,
    element: $('a#brevetX')
});
map.addOverlay(brevetX);