// Shortcut of the dependencies
const { Map, View, Feature } = ol;
const TileLayer = ol.layer.Tile;
const OSM = ol.source.OSM;
const { fromLonLat } = ol.proj;
const Overlay = ol.Overlay;
const { Style, Circle, Fill, Stroke } = ol.style;
const VectorLayer = ol.layer.Vector;
const VectorSource = ol.source.Vector;
const KML = ol.format.KML;

const posMarker = fromLonLat([7.064229, 43.617235]);
const posCenter = fromLonLat([24.596220, 53.700813]);

const styleCache = {};
let nuts = [];

const server_url = "http://localhost:8080";

window.onload = async _ => {
    document.querySelector('input#addVec').onkeydown = evt => {
        if (evt.key === "Enter") {
            if (nuts.some(o => o.code == evt.target.value)) {
                addVec(evt.target.value);
                evt.target.value = "";
            } else
                alert('Invalid nuts code !');
        }
    };

    const buf = await fetch(`${server_url}/api/getNuts`);
    nuts = await buf.json();
};

function addVec(name) {
    const vec = new VectorLayer({
        source: new VectorSource({
            url: `${server_url}/api/getGeometry/${name}`,
            format: new KML({
                extractStyles: false
            })
        }),
        style: feature => {
            const name = feature.get('name');
            let s = styleCache[name];
            if (!s) {
                s = new Style({
                    fill: new Stroke({
                        color: [255, 0, 0, 0.4]
                    }),
                    geometry: feature.get('geometry')
                });
                styleCache[name] = s;
            }
            return s;
        }
    });
    map.addLayer(vec);
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