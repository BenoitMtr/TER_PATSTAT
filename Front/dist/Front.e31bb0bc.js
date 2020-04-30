// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"index.js":[function(require,module,exports) {
function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// Shortcut of the dependencies
var _ol = ol,
    Map = _ol.Map,
    View = _ol.View;
var TileLayer = ol.layer.Tile;
var OSM = ol.source.OSM;
var fromLonLat = ol.proj.fromLonLat;
var Overlay = ol.Overlay;
var _ol$style = ol.style,
    Style = _ol$style.Style,
    Stroke = _ol$style.Stroke;
var VectorLayer = ol.layer.Vector;
var VectorSource = ol.source.Vector;
var KML = ol.format.KML;
var Select = ol.interaction.Select;
var click = ol.events.conditions;
var posMarker = fromLonLat([7.064229, 43.617235]);
var posCenter = fromLonLat([24.596220, 53.700813]);
var vecCache = {};
var nutsCache = {};
var nutsStack = []; //peut être utile par la suite, pour le moment on le remplit juste de tous les brevets de tous les nuts
//et on utilise ça pour afficher le nombre de brevets

var brevetsList = [];
var server_url = "http://localhost:8080"; //const server_url = "http://192.168.137.1:8080";

var $ = function $(e) {
  return document.querySelector(e);
};

window.onload = function (_) {
  return listNuts();
};

function listNuts() {
  return _listNuts.apply(this, arguments);
}

function _listNuts() {
  _listNuts = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var code,
        level,
        idx,
        buf,
        _args = arguments;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            code = _args.length > 0 && _args[0] !== undefined ? _args[0] : "";
            level = _args.length > 1 && _args[1] !== undefined ? _args[1] : 0;
            idx = code + ":" + level; // If NUTS not in cache create new

            if (nutsCache[idx]) {
              _context.next = 10;
              break;
            }

            _context.next = 6;
            return fetch("".concat(server_url, "/api/getNuts/").concat(level, "/").concat(code));

          case 6:
            buf = _context.sent;
            _context.next = 9;
            return buf.json();

          case 9:
            nutsCache[idx] = _context.sent;

          case 10:
            getNbBrevets(nutsCache[idx], idx);
            nutsStack.push(nutsCache[idx]);
            console.log(nutsCache[idx]);

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _listNuts.apply(this, arguments);
}

function updateTbody(nuts) {
  var tbody = $('table#listNuts tbody');
  tbody.innerHTML = "";
  var i = 0;
  var total = nuts.reduce(function (total, n) {
    var tr = document.createElement('tr');
    tr.innerHTML = "<td>".concat(n.code, "</td>\n                        <td>").concat(n.label, "</td>\n                        <td>").concat(n.nb_subnut, "</td>\n                        <td><button onclick='addVec(\"").concat(n.code, "\")'>Add</button></td>\n                        <td><button onclick='listNuts(\"").concat(n.code, "\", ").concat(n.level + 1, ")'>F</button></td>\n\t\t\t\t\t\t<td><label>").concat(brevetsList[i].length, "</label></td>\n\t\t\t\t<td><button onclick='listBrevets(\"").concat(n.code, "\")'>Liste de brevets</button></td>");

    tr.onmouseenter = function (_) {
      return addVec(n.code);
    };

    tr.onmouseleave = function (_) {
      return removeVec(n.code);
    };

    tbody.append(tr);
    i++;
    return total + n.nb_subnut;
  }, 0);
  $('td#totalNuts').innerHTML = nuts.length;
  $('td#totalSubNuts').innerHTML = total;
}

function backBtn() {
  if (document.querySelector('table#listBrevets').style.visibility == 'visible') {
    document.querySelector('table#listNuts').style.visibility = 'visible';
    document.querySelector('table#listBrevets').style.visibility = 'hidden';
    listNuts();
  }

  if (nutsStack.length == 1) {
    alert('Déja à la racine !');
    return;
  }

  nutsStack.pop();
  updateTbody(nutsStack[nutsStack.length - 1]);
}

function removeVec(name) {
  map.removeLayer(vecCache[name]);

  var _iterator = _createForOfIteratorHelper($('table#listOverlay tbody').childNodes),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var elt = _step.value;

      if (elt.id == name) {
        elt.remove();
        break;
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
}

function addVec(name) {
  // If VectorLayer not in cache create new
  if (!vecCache[name]) {
    vecCache[name] = new VectorLayer({
      source: new VectorSource({
        url: "".concat(server_url, "/api/getGeometry/").concat(name),
        format: new KML({
          extractStyles: false
        })
      }),
      style: function style(feature) {
        return new Style({
          fill: new Stroke({
            color: [255, 0, 0, 0.2]
          }),
          geometry: feature.get('geometry')
        });
      }
    });
  }

  map.addLayer(vecCache[name]);
  $('table#listOverlay tbody').innerHTML += "<tr id=\"".concat(name, "\"><td>").concat(name, "</td><td><button onclick=\"removeVec('").concat(name, "')\">X</button></td></tr>");
}

function listBrevets(_x) {
  return _listBrevets.apply(this, arguments);
}

function _listBrevets() {
  _listBrevets = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(code) {
    var buf;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return fetch("".concat(server_url, "/api/getBrevets/").concat(code));

          case 2:
            buf = _context2.sent;
            _context2.t0 = displayListBrevets;
            _context2.next = 6;
            return buf.json();

          case 6:
            _context2.t1 = _context2.sent;
            (0, _context2.t0)(_context2.t1);

          case 8:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _listBrevets.apply(this, arguments);
}

function getNbBrevets(_x2, _x3) {
  return _getNbBrevets.apply(this, arguments);
}

function _getNbBrevets() {
  _getNbBrevets = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(liste, idx) {
    var temp, i, buf;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            temp = null;
            i = 0;

          case 2:
            if (!(i < liste.length)) {
              _context3.next = 15;
              break;
            }

            _context3.next = 5;
            return fetch("".concat(server_url, "/api/getBrevets/").concat(liste[i].code));

          case 5:
            buf = _context3.sent;
            _context3.t0 = brevetsList;
            _context3.next = 9;
            return buf.json();

          case 9:
            _context3.t1 = _context3.sent;

            _context3.t0.push.call(_context3.t0, _context3.t1);

            console.log(brevetsList[i]);

          case 12:
            i++;
            _context3.next = 2;
            break;

          case 15:
            updateTbody(nutsCache[idx]);

          case 16:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _getNbBrevets.apply(this, arguments);
}

function displayListBrevets(liste) {
  console.log("liste: " + liste);
  document.querySelector('table#listNuts').style.visibility = 'hidden';
  document.querySelector('table#listBrevets').style.visibility = 'visible';
  var tbody = $('table#listBrevets tbody');
  tbody.innerHTML = "";
  var total = liste.reduce(function (total, n) {
    var tr = document.createElement('tr');
    tr.innerHTML = "<td>".concat(n.appln_id, "</td>\n                        <td>").concat(n.person_name, "</td>\n\t\t\t\t\t\t<td>").concat(n.appln_title, "</td>\n                        <td>").concat(n.appln_filing_date, "</td>");
    tbody.append(tr);
    return total;
  }, 0);
}

var map = new Map({
  target: 'map',
  layers: [new TileLayer({
    source: new OSM()
  })],
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
},{}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "65424" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/Front.e31bb0bc.js.map