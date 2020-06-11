const server_url = "http://localhost:8080";
//const server_url = "http://192.168.137.1:8080";

const feature_cache = new Map();
//peut être utile par la suite, pour le moment on le remplit juste de tous les brevets de tous les nuts
//et on utilise ça pour afficher le nombre de brevets
const brevetsCache = new Map();
const nutsCache = new Map();
const collabCache = new Map();

function fetcher() {
    return listNuts("",0,annee).then(async idx => {
        const nuts = nutsCache.get(idx);
        updateTbody(nuts);

        getCollab(domaineCode, annee).then(collabs => {
            console.log("collabs", collabs);
        });
        for (let i = 1; i < 4; i++)
            await fetchGeoJSON(i);
        await fetchGeoJSON(0);
    });
}

async function listNuts(code = "", level = 0, annee) {
    const idx = code + ":" + level;
    // If NUTS not in cache create new
    if (!nutsCache.has(idx) || annee!=0) {
        const buf = await fetch(`${server_url}/api/getNuts?level=${level}&code=${code}`);
        nutsCache.set(idx, await buf.json());
    }

    getNbBrevets(idx, domaineCode, annee);
    nutsStack.push(nutsCache.get(idx));
    console.log("nutsCache", nutsCache.get(idx));
    return idx;
}

function fetchGeoJSON(level) {
    return Promise.all(["RG", "LB"].map(arg =>
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

async function getBrevets(code, domaine, annee, pageSize = 20, page = 0) {
    const hash = `${code}:${domaine}:${annee}:${page}`;
    if (!brevetsCache.has(hash)) {
        const buf = await fetch(`${server_url}/api/getBrevets/${code}/${domaine}/${annee}?pagesize=${pageSize}&page=${page}`);
        const bvt = await buf.json();
        brevetsCache.set(hash, bvt);
    }
    return brevetsCache.get(hash);
}

function getNbBrevets(idx, domaine, annee) {
    return new Promise((resolve, _) => {
        const nuts = nutsCache.get(idx);
        if (!nuts.done)
            resolve(Promise.all(nutsCache.get(idx).map(nuts =>
                new Promise(async (resolve, _) => {
                    if (!nuts.nb_brevet)
                        nuts.nb_brevet = new Map();
                    if (!nuts.nb_brevet.has(domaine)) {
							console.log("entré dans getnbbrevets");

                        const buf = await fetch(`${server_url}/api/getNbBrevets/${nuts.code}/${domaine}/${annee}`);
                        const nb_brevet = (await buf.json())[0].nb_brevet;
                        nuts.nb_brevet.set(domaine, nb_brevet);
                    }
                    $('table#listNuts tbody tr td label#nbBrevet' + nuts.code)[0].innerHTML = nuts.nb_brevet.get(domaine);
                    resolve();
                })
            )));
        else resolve();
    });
}

function getCollab(domaine, annee) {
    return new Promise(async (resolve, reject) => {
        try {
            if (!collabCache.has(domaine)) {
                const obj = {};
                for (let code of nutsCache.get(":0")) {
                    obj[code.code] = { code: [], nb: [] };
                }
                const buf = await fetch(`${server_url}/api/getCollab/${domaine}/${annee}`);
                const jsn = await buf.json();
                jsn.forEach(app => {
                    const collab = app.collab.split(':');
                    const nb = app.nb_person_collab.split(':').map(Number.parseInt);
                    collab.forEach(code => {
                        collab.forEach((colla, j) => {
                            if (code == colla)
                                return;
                            const v = obj[code];
                            if (v.code.indexOf(colla) == -1) {
                                v.code.push(colla);
                                v.nb.push(nb[j]);
                            }
                        });
                    });
                });
                collabCache.set(domaine, obj);
            }
            resolve(collabCache.get(domaine));
        } catch (err) {
            console.error("Can't fetch collab", domaine);
            reject(err);
        }
    });
}