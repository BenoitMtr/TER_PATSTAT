// Shortcut of the dependencies
const { View, Overlay } = ol;
const { Tile: TileLayer, Vector: VectorLayer } = ol.layer;
const { Fill, Style, Stroke, Circle: CircleStyle, Text } = ol.style;
const { OSM, Vector: VectorSource } = ol.source;
const { KML, GeoJSON } = ol.format;
const { fromLonLat } = ol.proj;
const { LineString, MultiLineString, Point } = ol.geom;
const { Feature } = ol;

const nutsStack = [];

let brevetVisibles = false;

let map;

const $ = e => document.querySelectorAll(e);

window.onload = _ => {
    $('table#listNuts tfoot tr td button, table#listBrevets tfoot tr td button').forEach(elt => elt.onclick = _ => backBtn());
    map = new CustomMap($('div#map')[0]);
    listNuts();

    fetchGeoJSON();
};

function updateTbody(nuts) {
    const tbody = $('table#listNuts tbody')[0];
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
        tr.children[4].children[0].onclick = _ => listNuts(n.code, n.level + 1);
        tr.children[6].children[0].onclick = _ => displayListBrevets(brevetsCache[n.code]);
        if (n.has_gps) {
            tr.children[3].children[0].onclick = _ => {
                map.showKML(`${server_url}/api/getGeometry/${n.code}`, n.code);
                addVec(n.code, _ => map.hideKML(n.code));
            };
            tr.onmouseenter = _ => map.highlight(n.code, brevetsCache[n.code].length);
            tr.onmouseleave = _ => map.unhighlight(n.code);
        } else {
            tr.children[3].children[0].onclick = _ => alert("No gps for this NUTS");
            tr.style.backgroundColor = '#FF000033';
        }
        tbody.append(tr);
        return total + n.nb_subnut;
    }, 0);
    $('td#totalNuts')[0].innerHTML = nuts.length;
    $('td#totalSubNuts')[0].innerHTML = total;
}

function backBtn() {
    if (brevetVisibles) {
        brevetVisibles = false;
        $('table#listNuts')[0].style.visibility = 'visible';
        $('table#listBrevets')[0].style.visibility = 'hidden';
        return;
    }

    if (nutsStack.length == 1) {
        alert('Déja à la racine !');
        return;
    }
    nutsStack.pop();
    updateTbody(nutsStack[nutsStack.length - 1]);
}

function addVec(name, onRemoveCallback) {
    const tr = document.createElement('tr');
    const htmlSafeName = name.replace(' ', '-'); // WARN: It's not the best way safety wise
    tr.id = `layer${htmlSafeName}`;
    tr.innerHTML = `<td>${name}</td><td><button>X</button></td>`;
    tr.children[1].children[0].onclick = _ => {
        onRemoveCallback();
        $('table#listOverlay tbody tr#layer' + htmlSafeName)[0].remove();
    };
    $('table#listOverlay tbody')[0].append(tr);
}

function displayListBrevets(liste) {
    console.log("liste: " + liste);
    brevetVisibles = true;
    $('table#listNuts')[0].style.visibility = 'hidden';
    $('table#listBrevets')[0].style.visibility = 'visible';
    const tbody = $('table#listBrevets tbody')[0];
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