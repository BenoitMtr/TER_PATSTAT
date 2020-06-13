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
                center: fromLonLat([14, 53]),
                zoom: 5
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
            highlightLB: (width, min, max) => new Style({
                stroke: new Stroke({
                    color: 'rgba(0, 0, 0, 0.5)',
                    width: norm(width, min, max, 3, 50)
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

    showCentroids() {
        const vecHash = this.formatCode.centroids(0);
        if (!this.vecCache.has(vecHash)) {
            let [min, max] = [Infinity, -Infinity];
            const points_feat = nuts.map(nut => {
                const { code } = nut;
                const nb_brevet = nbBrevet["y" + annee][domaineCode][code] || 0;
                if (nb_brevet < min)
                    min = nb_brevet;
                if (nb_brevet > max)
                    max = nb_brevet;
                const feat = feats.lb.getFeatureById(code);
                feat.set("nb_brevet", nb_brevet);
                return feat;
            });

            this.vecCache.set(vecHash, new VectorLayer({
                source: new VectorSource({
                    features: points_feat
                }),
                style: this.style.highlightCO(min, max)
            }));
        }
        this.addVec(vecHash);
    }

    hideCentroids() {
        this.removeVec(this.formatCode.centroids(0));
    }

    highlight(name) {
        const vecName = this.formatCode.highlight(name);
        let vecHash = vecName + " LB";
        if (!this.vecCache.has(vecHash)) {
            const collab_nut = collab["y" + annee][domaineCode][name] || {};
            const feat_high = feats.lb.getFeatureById(name).getGeometry().getCoordinates();

            let min_collab = Infinity;
            let max_collab = -Infinity;
            const geom_arr = Object.keys(collab_nut).reduce((arr, code) => {
                const feat = feats.lb.getFeatureById(code);
                if (feat == null) {
                    console.warn("No feature called", code);
                } else {
                    const featObj = new Feature({
                        geometry: new LineString([feat_high, feat.getGeometry().getCoordinates()]),
                        width: collab_nut[code]
                    });
                    min_collab = Math.min(min_collab, collab_nut[code]);
                    max_collab = Math.max(max_collab, collab_nut[code]);
                    arr.push(featObj);
                }
                return arr;
            }, []);

            this.vecCache.set(vecHash, new VectorLayer({
                source: new VectorSource({ features: geom_arr }),
                style: feat => this.style.highlightLB(feat.get('width'), min_collab, max_collab)
            }));
        }
        this.addVec(vecHash);

        if (!this.vecCache.has(vecHash = vecName + " RG"))
            this.vecCache.set(vecHash, createVector(feats.rg.getFeatureById(name), this.style.highlightRG));
        this.addVec(vecHash);

        if (!this.vecCache.has(vecHash = vecName + " CO"))
            this.vecCache.set(vecHash, createVector(feats.lb.getFeatureById(name), this.style.highlightName(name)));
        this.addVec(vecHash);

        return vecName;
    }

    unhighlight(name) {
        const vecName = this.formatCode.highlight(name);
        ["LB", "RG", "CO"].forEach(hash => this.removeVec(vecName + " " + hash));
    }
}

function createVector(features, style) {
    return new VectorLayer({
        source: new VectorSource({
            features: [features]
        }),
        style
    });
}

const number_subfix = ["", "K", "M", "B", "T"];

function formatNumber(value) {
    let idx = 0;
    while (value >= 1e3) {
        value /= 1e3;
        idx++;
    }
    return idx == 0 ? value.toString() : value.toFixed(2) + number_subfix[idx];
}

function norm(v, f1, f2, l1, l2) { return l1 + (l2 - l1) * ((v - f1) / (f2 - f1)); }