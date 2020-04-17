//const server_url = "http://localhost:8080";
const server_url = "http://192.168.137.1:8080";

const feature_cache = {};
//peut être utile par la suite, pour le moment on le remplit juste de tous les brevets de tous les nuts
//et on utilise ça pour afficher le nombre de brevets
const brevetsCache = {};
const nutsCache = {};


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

function fetchGeoJSON() {

    const testStyle = {
        'Point': new Style({
            image: new CircleStyle({
                radius: 5,
                fill: new Fill({
                    color: 'rgba(0, 0, 255, 0.6)'
                }),
                stroke: new Stroke({
                    color: 'rgba(0, 255, 0, 0.3)',
                    width: 1
                })
            })
        }),
        'Polygon': new Style({
            stroke: new Stroke({
                color: 'green',
                width: 2
            }),
            fill: new Fill({
                color: 'rgba(255, 0, 0, 0.2)'
            })
        })
    };
    testStyle.MultiPolygon = testStyle.Polygon;

    Promise.all(["RG", "LB"].map(arg => {
        return new Promise(async (resolve, reject) => {
            try {
                const buf = await fetch(`${server_url}/api/getGeoJson/${arg}`);
                const geojsonObject = await buf.json();

                const features = new GeoJSON().readFeatures(geojsonObject);
                console.log(arg, features);

                const testVectorLayer = new VectorLayer({
                    source: new VectorSource({
                        features: features
                    }),
                    style: feature => {
                        const feat_type = feature.getGeometry().getType();
                        switch (feat_type) {

                            case 'Point':
                                return testStyle.Point;

                            case 'Polygon':
                            case 'MultiPolygon':
                                return testStyle.Polygon;

                            default:
                                console.error('Feature non supportée', feat_type);
                                return new Style({
                                    fill: new Fill({
                                        color: 'rgba(0, 0, 0, 1)'
                                    })
                                });
                        }
                    }
                });
                feature_cache[arg] = testVectorLayer.getSource();
                //map.addLayer(testVectorLayer);
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }));
}

async function getNbBrevets(idx) {
    await Promise.all(nutsCache[idx].map(nuts =>
        new Promise(async (resolve, _) => {
            if (!brevetsCache[nuts.code]) {
                const buf = await fetch(`${server_url}/api/getBrevets/${nuts.code}`);
                const bvt = await buf.json();
                brevetsCache[nuts.code] = bvt;
            }
            //console.log(brevetsCache[nuts.code]);
            resolve();
        })
    ));
    updateTbody(nutsCache[idx]);
}