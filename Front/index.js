import 'ol/ol.css';
import {
  Map,
  View,
  Feature
} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import {
  fromLonLat
} from 'ol/proj';
import Overlay from 'ol/Overlay';
import VectorLayer from 'ol/layer';
import KML from 'ol/format';
import VectorSource from 'ol/source/Vector';

var posMarker = fromLonLat([7.064229, 43.617235]);
var posCenter = fromLonLat([24.596220, 53.700813])

const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM()
    })
    /*,
        new VectorLayer({
          source: new VectorSource({
            url: 'data/tmp-nuts-test.kml',
            format: new KML()
          })
        })*/
  ],
  view: new View({
    center: posCenter,
    zoom: 4
  })
});

var marker = new Overlay({
  position: posMarker,
  positioning: 'center-center',
  element: document.getElementById('marker'),
  stopEvent: false
});
map.addOverlay(marker);

var brevetX = new Overlay({
  position: posMarker,
  element: document.getElementById('brevetX')
});
map.addOverlay(brevetX);