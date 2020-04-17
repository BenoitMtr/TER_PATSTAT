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

        this.vecCache = {};
        this.kmlCache = {};

        this.formatCode = {
            highlight: name => "Highlight " + name,
            KML: name => "KML " + name
        };
    }

    removeVec(name) {
        this.removeLayer(this.vecCache[name]);
    }

    addVec(name) {
        if (!this.vecCache[name]) {
            console.warn('No vector saved named', name);
            return;
        }
        this.addLayer(this.vecCache[name]);
    }

    highlight(name, nb_bevret) {
        const vecName = this.formatCode.highlight(name);
        if (!this.vecCache[vecName + "LB"]) {
            const feat_high = feature_cache.LB.getFeatureById(name).getGeometry().getCoordinates();

            const geom_arr = new MultiLineString(feature_cache.LB.getFeatures().reduce((arr, feat, i) => {
                if (feat.name === name)
                    return arr;
                arr.push(new LineString([feat_high, feat.getGeometry().getCoordinates()]));
                return arr;
            }, []));

            const styles = geom_arr.getLineStrings().map((ls) => {
                return new Style({
                    stroke: new Stroke({
                        color: 'rgba(0, 0, 0, 0.8)',
                        width: 1 // TODO Independant width for each linestring
                    })
                });
            });

            this.vecCache[vecName + "LB"] = new VectorLayer({
                source: new VectorSource({
                    features: [new Feature({
                        'geometry': geom_arr
                    })]
                }),
                style: styles
            });
        }
        this.addVec(vecName + "LB");

        if (!this.vecCache[vecName + "RG"]) {
            this.vecCache[vecName + "RG"] = new VectorLayer({
                source: new VectorSource({
                    features: [new Feature({
                        'geometry': feature_cache.RG.getFeatureById(name).getGeometry()
                    })]
                }),
                style: new Style({
                    fill: new Fill({
                        color: 'rgba(255, 0, 0, 0.2)'
                    })
                })
            });
        }
        this.addVec(vecName + "RG");

        if (!this.vecCache[vecName + "CO"]) {
            this.vecCache[vecName + "CO"] = new VectorLayer({
                source: new VectorSource({
                    features: [feature_cache.LB.getFeatureById(name)]
                }),
                style: new Style({
                    image: new CircleStyle({
                        radius: 10,
                        fill: new Fill({
                            color: 'rgba(0, 0, 255, 1)'
                        })
                    }),
                    text: new Text({
                        font: '12px Calibri,sans-serif',
                        text: nb_bevret.toString(),
                        fill: new Fill({
                            color: 'rgba(255, 255, 255, 1)'
                        }),
                        stroke: new Stroke({
                            color: 'rgba(255, 255, 255, 1)'
                        })
                    })
                })
            });
        }
        this.addVec(vecName + "CO");

        return vecName;
    }

    unhighlight(name) {
        this.removeVec(this.formatCode.highlight(name) + "LB");
        this.removeVec(this.formatCode.highlight(name) + "RG");
        this.removeVec(this.formatCode.highlight(name) + "CO");
    }

    showKML(url, name) {
        const vecName = this.formatCode.KML(name);
        // If VectorLayer not in cache create new
        if (!this.vecCache[vecName]) {
            this.vecCache[vecName] = new VectorLayer({
                source: new VectorSource({
                    url: url,
                    format: new KML({
                        extractStyles: false
                    })
                }),
                style: feature => new Style({
                    fill: new Stroke({
                        color: [255, 0, 0, 0.8]
                    }),
                    geometry: feature.get('geometry')
                })
            });
        }
        this.addVec(vecName);
        return vecName;
    }

    hideKML(name) {
        this.removeVec(this.formatCode.KML(name));
    }
}