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

let domaineCode = 'na';
let annee='0';
let brevetVisibles = false;

let pagesize = 30;
let page = 0;

let map;

const $ = e => document.querySelectorAll(e);

window.onload = _ => {
    fetcher(annee).then(_ => {
        map.showCentroids(0);
    });
    $('table#listNuts tfoot tr td button, table#listBrevets tfoot tr td button:first-child').forEach(elt => elt.onclick = _ => backBtn());
    $('select#domaines_brevets')[0].onchange = evt => setDomaineCode(evt.target.value);
	$('input#annees_brevets')[0].onchange = evt => setAnnee(evt.target.value);
    map = new CustomMap($('div#map')[0]);

    document.body.onkeydown = evt => {
        if (evt.key === "Escape") {
            backBtn();
        }
    };
};

function setDomaineCode(domaine) {
    domaineCode = domaine;
    console.log("domaine", domaine);
    fetcher().then(_ => {
        map.reloadCache();
    });
}

function setAnnee(date)
{
	let temp=date.split('-');
	annee=temp[0];
	fetcher().then(_ => {
				console.log(annee);

        map.reloadCache();
    });
}

function updateTbody(nuts) {
    const tbody = $('table#listNuts tbody')[0];
    tbody.innerHTML = "";
    const total = nuts.reduce((total, n) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${n.code}</td>
                        <td>${n.label}</td>
                        <td><label>${n.nb_subnut}</label></td>
                        <td><button>Add</button></td>
                        <td><button>F</button></td>
						<td><label id='nbBrevet${n.code}'>${n.nb_brevet.get(domaineCode)||0}</label></td>
				        <td><button>Liste de brevets</button></td>`;
        tr.children[4].children[0].onclick = async _ => updateTbody(nutsCache.get(await listNuts(n.code, n.level + 1, annee)));
        tr.children[6].children[0].onclick = _ => displayListBrevets(n, domaineCode, annee);
        let trVec;
        tr.onmouseenter = _ => {
            map.highlight(n.code, n.level, n.nb_brevet.get(domaineCode) || 0);
            trVec = addVec("Highlight " + n.code, _ => map.unhighlight(n.code));
        };
        tr.onmouseleave = _ => {
            map.unhighlight(n.code);
            trVec.remove();
        };

        tr.children[3].children[0].onclick = n.has_gps ? _ => {
            map.showKML(`${server_url}/api/getGeometry/${n.code}`, n.code);
            addVec("KML " + n.code, _ => map.hideKML(n.code));
        } : _ => alert("No KML for this NUTS");

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

function displayListBrevets(nuts, domaine, annee) {
    brevetVisibles = true;
    page = 0;
    $('table#listNuts')[0].style.visibility = 'hidden';
    $('table#listBrevets')[0].style.visibility = 'visible';
    $('table#listBrevets tfoot tr td button')[1].onclick = _ => {
        page--;
        showBrevets(nuts, domaine, annee);
    };
    $('table#listBrevets tfoot tr td button')[2].onclick = _ => {
        page++;
        showBrevets(nuts, domaine, annee);
    };

    showBrevets(nuts, domaine, annee);
}

async function showBrevets(nuts, domaine, annee) {
    $('table#listBrevets tfoot tr td')[2].innerHTML = `${page + 1}/${Math.ceil(nuts.nb_brevet.get(domaineCode) / pagesize)}`;
    const tbody = $('table#listBrevets tbody')[0];
    tbody.innerHTML = "<tr><td>Chargement...</td></tr>";
    const liste = await getBrevets(nuts.code, domaine, annee, pagesize, page);
    tbody.innerHTML = "";
    console.log("liste: ");
    console.table(liste);
    liste.forEach(n => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${n.appln_id}</td>
                            <td>${n.person_name}</td>
                            <td>${n.appln_title}</td>
                            <td>${n.appln_filing_date}</td>`;
        tbody.append(tr);
    });
}