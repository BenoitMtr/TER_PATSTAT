const server_url = "http://localhost:8080";
//const server_url = "http://192.168.137.1:8080";

const feature_cache = new Map();
//peut être utile par la suite, pour le moment on le remplit juste de tous les brevets de tous les nuts
//et on utilise ça pour afficher le nombre de brevets
const brevetsCache = new Map();
const nutsCache = new Map();


async function listNuts(code = "", level = 0) {
    const idx = code + ":" + level;
    // If NUTS not in cache create new
    if (!nutsCache.has(idx)) {
        const buf = await fetch(`${server_url}/api/getNuts?level=${level}&code=${code}`);
        nutsCache.set(idx, await buf.json());
    }

    nutsStack.push(nutsCache.get(idx));
    console.log(nutsCache.get(idx));
    return idx;
}

function fetchGeoJSON(level) {
    Promise.all(["RG", "LB"].map(arg =>
        new Promise(async (resolve, reject) => {
            try {
                const buf = await fetch(`${server_url}/api/getGeoJson/${arg}?level=${level}`);
                const geojsonObject = await buf.json();

                const features = new GeoJSON().readFeatures(geojsonObject);
                feature_cache.set(arg + ":" + level, new VectorSource({ features: features }));
                resolve();
            } catch (error) {
                console.error("Can't fetch GeoJSON", arg);
                reject(error);
            }
        })
    ));
}

async function getBrevets(code, domaine) {
		const buf = await fetch(`${server_url}/api/getBrevets/${code}/${domaine}`);

        const bvt = await buf.json();
        brevetsCache.set(code, bvt);
    return brevetsCache.get(code);
}

function getNbBrevets(idx, domaine) {
    Promise.all(nutsCache.get(idx).map(nuts =>
        new Promise(async (resolve, _) => {
            const buf = await fetch(`${server_url}/api/getNbBrevets/${nuts.code}/${domaine}`);
            const nb_brevet = (await buf.json())[0].nb_brevet;
            nuts.nb_brevet = nb_brevet;
            $('table#listNuts tbody tr td label#nbBrevet' + nuts.code)[0].innerHTML = nb_brevet;
            resolve();
        })
    ));
}