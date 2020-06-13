// Shortcut of the dependencies
const { View, Overlay } = ol;
const { Tile: TileLayer, Vector: VectorLayer } = ol.layer;
const { Fill, Style, Stroke, Circle: CircleStyle, Text } = ol.style;
const { OSM, Vector: VectorSource } = ol.source;
const { KML, GeoJSON } = ol.format;
const { fromLonLat } = ol.proj;
const { LineString, MultiLineString, Point } = ol.geom;
const { Feature } = ol;
const $ = e => document.querySelectorAll(e);

const feats = {};
let nuts = [];
let nbBrevet = [];
let collab = [];

let domaineCode, annee;

let map;


window.onload = _ => {
    Promise.all(["nuts", "nbBrevets", "collab"].map(s => fetch(`assets/data/${s}.json`)))
        .then(buf => Promise.all(buf.map(b => b.json())))
        .then(data => {
            [nuts, nbBrevet, collab] = data;
            console.log(nuts);
            updateTbody(nuts);
            Promise.all(["rg", "lb"].map(arg => new Promise(async (resolve, reject) => {
                try {
                    const buf = await fetch(`assets/data/${arg}.geojson`);
                    const doc = await buf.json();
                    const features = new GeoJSON().readFeatures(doc);
                    feats[arg] = new VectorSource({ features });
                    resolve();
                } catch (err) {
                    console.error("Error fetching GeoJSON", err);
                    reject(err);
                }
            }))).then(_ => {
                map.showCentroids();
            });
        });
    $('table#listNuts tfoot tr td button, table#listBrevets tfoot tr td button:first-child').forEach(elt => elt.onclick = _ => backBtn());
    $('select#domaines_brevets')[0].onchange = evt => setDomaineCode(evt.target.value);
    $('input#annees_brevets')[0].onchange = setAnnee;
    annee = $("input#annees_brevets")[0].valueAsNumber;
    domaineCode = $("select#domaines_brevets")[0].value;
    map = new CustomMap($('div#map')[0]);

    document.body.onkeydown = evt => {
        if (evt.key === "Escape") {
            backBtn();
        }
    };
};

function setDomaineCode(domaine) {
    domaineCode = domaine;
    map.reloadCache();
    updateTbody();
}

function setAnnee(evt) {
    const { valueAsNumber: value } = evt.target;
    if (nbBrevet["y" + value]) {
        annee = value;
        map.reloadCache();
        updateTbody();
    } else {
        alert(`Données pour l'année ${value} sont indisponibles`);
        evt.target.valueAsNumber = annee;
    }
}

function updateTbody() {
    const tbody = $('table#listNuts tbody')[0];
    tbody.innerHTML = "";
    const total = nuts.reduce((total, n) => {
        const { code, name } = n;
        const tr = document.createElement('tr');
        const nb_brevet = nbBrevet["y" + annee][domaineCode][code] || 0;
        tr.innerHTML = `<td>${code}</td><td>${name}</td>
						<td><label id='nbBrevet${code}'>${formatNumber(nb_brevet)}</label></td>`;
        let trVec;
        tr.onmouseenter = _ => {
            map.highlight(code, 0, nb_brevet);
            trVec = addVec("Highlight " + code, _ => map.unhighlight(code));
        };
        tr.onmouseleave = _ => {
            map.unhighlight(code);
            trVec.remove();
        };

        tbody.append(tr);
        return total + nb_brevet || 0;
    }, 0);
    $('th#totalNuts')[0].innerHTML = nuts.length;
    $('th#totalBrevets')[0].innerHTML = formatNumber(total);
}

function addVec(name, onRemoveCallback = _ => {}) {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${name}</td><td><button>X</button></td>`;
    tr.children[1].children[0].onclick = _ => {
        onRemoveCallback();
        tr.remove();
    };
    $('table#listOverlay tbody')[0].append(tr);
    return tr;
}