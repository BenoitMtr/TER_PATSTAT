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
            KML: name => "KML " + name
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
                    color: 'rgba(0, 0, 0, 0.8)',
                    width: width // TODO Independant width for each linestring
                })
            }),
            // NUTS surface
            highlightRG: new Style({
                fill: new Fill({
                    color: 'rgba(255, 0, 0, 0.2)'
                })
            }),
            // Centroid
            highlightCO: nb_brevet => {
                return new Style({
                    image: new CircleStyle({
                        radius: 20,
                        fill: new Fill({
                            color: 'rgba(0, 0, 255, 1)'
                        })
                    }),
                    text: new Text({
                        font: '22px Calibri,sans-serif',
                        text: nb_brevet.toString(),
                        fill: new Fill({
                            color: 'rgba(255, 255, 255, 1)'
                        }),
                        stroke: new Stroke({
                            color: 'rgba(255, 255, 255, 1)'
                        })
                    })
                });
            }
        };

        this.displayedLayers = new Set();
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

    highlight(name, level, nb_brevet) {
        const vecName = this.formatCode.highlight(name);
        let vecHash = vecName + " LB";
        if (!this.vecCache.has(vecHash)) {
            const featureLB = feature_cache.get("LB:" + level);
            if (!featureLB)
                return false;
            const feat_high = featureLB.getFeatureById(name).getGeometry().getCoordinates();

            const geom_arr = new MultiLineString(featureLB.getFeatures().reduce((arr, feat) => {
                if (feat.name !== name)
                    arr.push(new LineString([feat_high, feat.getGeometry().getCoordinates()]));
                return arr;
            }, []));

            this.vecCache.set(vecHash, createVector(new Feature({ 'geometry': geom_arr }), this.style.highlightLB(1)));
        }
        this.addVec(vecHash);

        if (!this.vecCache.has(vecHash = vecName + " RG"))
            this.vecCache.set(vecHash, createVector(feature_cache.get("RG:" + level).getFeatureById(name), this.style.highlightRG));
        this.addVec(vecHash);

        if (!this.vecCache.has(vecHash = vecName + " CO"))
            this.vecCache.set(vecHash, createVector(feature_cache.get("LB:" + level).getFeatureById(name), this.style.highlightCO(formatNumber(nb_brevet))));
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