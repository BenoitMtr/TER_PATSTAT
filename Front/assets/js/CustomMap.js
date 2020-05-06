class CustomMap extends ol.Map {
    constructor(elt) {
        super({
            target: elt,
            layers: [
                new TileLayer({
                    source: new OSM()
                })
            ],
            view: new View({
                center: fromLonLat([24.596220, 53.700813]), //center of europe
                zoom: 4.5
            })
        });

        this.vecCache = new Map();
        this.kmlCache = new Map();

        this.formatCode = {
            highlight: name => "Highlight " + name,
            KML: name => "KML " + name,
            centroids: level => "Centroids " + level,
            collab: (nuts_code, domaine) => `Collab ${nuts_code} : ${domaine}`
        };

        this.style = {
            kml: feature => new Style({
                fill: new Stroke({
                    color: [255, 0, 0, 0.8]
                }),
                geometry: feature.get('geometry')
            }),
            // Connection between NUTS
            highlightLB: width => new Style({
                stroke: new Stroke({
                    color: 'rgba(0, 0, 0, 0.5)',
                    width: width
                })
            }),
            // NUTS surface
            highlightRG: new Style({
                fill: new Fill({
                    color: 'rgba(255, 0, 0, 0.2)'
                })
            }),
            // Centroid
            highlightCO: (min, max) => feat => new Style({
                image: new CircleStyle({
                    radius: norm(feat.get("nb_brevet"), min, max, 20, 50),
                    fill: new Fill({
                        color: 'rgba(0, 0, 255, 0.4)'
                    })
                }),
                text: new Text({
                    font: '22px Calibri,sans-serif',
                    text: formatNumber(feat.get("nb_brevet")),
                    fill: new Fill({
                        color: 'rgba(255, 255, 255, 1)'
                    }),
                    stroke: new Stroke({
                        color: 'rgba(255, 255, 255, 1)'
                    })
                })
            }),
            highlightName: name => new Style({
                image: new CircleStyle({
                    radius: 20,
                    fill: new Fill({
                        color: 'rgba(0, 0, 255, 0.4)'
                    })
                }),
                text: new Text({
                    font: '22px Calibri,sans-serif',
                    text: name,
                    fill: new Fill({
                        color: 'rgba(255, 255, 255, 1)'
                    }),
                    stroke: new Stroke({
                        color: 'rgba(255, 255, 255, 1)'
                    })
                })
            })
        };

        this.displayedLayers = new Set();
    }

    reloadCache() {
        const centroidsHash = this.formatCode.centroids(0);
        if (this.displayedLayers.has(centroidsHash)) {
            this.removeVec(centroidsHash);
            this.vecCache.delete(centroidsHash);
            this.showCentroids(0);
        }
        // TODO Add all types ...
    }

    removeVec(name) {
        if (this.displayedLayers.has(name)) {
            this.removeLayer(this.vecCache.get(name));
            this.displayedLayers.delete(name);
        } else
            console.warn("No layer added named", name);
    }

    addVec(name) {
        if (!this.vecCache.has(name))
            console.warn('No vector saved named', name);
        else if (this.displayedLayers.has(name))
            console.warn("layer already added");
        else {
            this.addLayer(this.vecCache.get(name));
            this.displayedLayers.add(name);
        }
    }

    showCentroids(level = 0) {
        const vecHash = this.formatCode.centroids(level);
        if (!this.vecCache.has(vecHash)) {
            let [min, max] = [Infinity, -Infinity];
            const points_feat = nutsCache.get(":" + level).map(n => {
                const nb_brevet = n.nb_brevet.get(domaineCode) || 0;
                if (nb_brevet < min)
                    min = nb_brevet;
                if (nb_brevet > max)
                    max = nb_brevet;
                const feat = feature_cache.get("LB:" + n.level).getFeatureById(n.code);
                feat.set("nb_brevet", nb_brevet);
                return feat;
            });
            console.log("centroids points_feats", points_feat);

            this.vecCache.set(vecHash, new VectorLayer({
                source: new VectorSource({
                    features: points_feat
                }),
                style: this.style.highlightCO(min, max)
            }));
        }
        this.addVec(vecHash);
    }

    hideCentroids(level = 0) {
        this.removeVec(this.formatCode.centroids(level));
    }

    highlight(name, level = 0, nb_brevet = 0) {
        const vecName = this.formatCode.highlight(name);
        let vecHash = vecName + " LB";
        if (!this.vecCache.has(vecHash)) {
            const collab = collabCache.get('na');
            const featureLB = feature_cache.get("LB:" + level);
            if (featureLB == null || collab[name] == null)
                return;
            const feat_high = featureLB.getFeatureById(name).getGeometry().getCoordinates();

            const geom_arr = collab[name].code.reduce((arr, code, i) => {
                const feat = featureLB.getFeatureById(code);
                if (feat == null) {
                    console.warn("No feature called", code);
                } else {
                    const featObj = new Feature({
                        geometry: new LineString([feat_high, feat.getGeometry().getCoordinates()]),
                        width: collab[name].nb[i]
                    });
                    arr.push(featObj);
                }
                return arr;
            }, []);

            this.vecCache.set(vecHash, new VectorLayer({
                source: new VectorSource({
                    features: geom_arr
                }),
                style: feat => this.style.highlightLB(feat.get('width'))
            }));
        }
        this.addVec(vecHash);

        if (!this.vecCache.has(vecHash = vecName + " RG"))
            this.vecCache.set(vecHash, createVector(feature_cache.get("RG:" + level).getFeatureById(name), this.style.highlightRG));
        this.addVec(vecHash);

        if (!this.vecCache.has(vecHash = vecName + " CO"))
            this.vecCache.set(vecHash, createVector(feature_cache.get("LB:" + level).getFeatureById(name), this.style.highlightName(name)));
        this.addVec(vecHash);

        return vecName;
    }

    unhighlight(name) {
        const vecName = this.formatCode.highlight(name);
        ["LB", "RG", "CO"].forEach(hash => this.removeVec(vecName + " " + hash));
    }

    showKML(url, name) {
        const vecName = this.formatCode.KML(name);
        // If VectorLayer not in cache create new
        if (!this.vecCache.has(vecName)) {
            this.vecCache.set(vecName, new VectorLayer({
                source: new VectorSource({
                    url: url,
                    format: new KML({
                        extractStyles: false
                    })
                }),
                style: this.style.kml
            }));
        }
        this.addVec(vecName);
        return vecName;
    }

    hideKML(name) {
        this.removeVec(this.formatCode.KML(name));
    }
}

function createVector(features, style) {
    return new VectorLayer({
        source: new VectorSource({
            features: [features]
        }),
        style: style
    });
}

const number_subfix = [
    "", "k", "m", "B", "Bm"
];

function formatNumber(value) {
    let idx = 0;
    while (value >= 1e3) {
        value /= 1e3;
        idx++;
    }
    return value.toFixed(0) + number_subfix[idx];
}

function norm(v, f1, f2, l1, l2) { return l1 + (l2 - l1) * ((v - f1) / (f2 - f1)); }