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
})({"assets/js/index.js":[function(require,module,exports) {
// Shortcut of the dependencies
var _ol = ol,
    View = _ol.View,
    Overlay = _ol.Overlay;
var _ol$layer = ol.layer,
    TileLayer = _ol$layer.Tile,
    VectorLayer = _ol$layer.Vector;
var _ol$style = ol.style,
    Fill = _ol$style.Fill,
    Style = _ol$style.Style,
    Stroke = _ol$style.Stroke,
    CircleStyle = _ol$style.Circle,
    Text = _ol$style.Text;
var _ol$source = ol.source,
    OSM = _ol$source.OSM,
    VectorSource = _ol$source.Vector;
var _ol$format = ol.format,
    KML = _ol$format.KML,
    GeoJSON = _ol$format.GeoJSON;
var fromLonLat = ol.proj.fromLonLat;
var _ol$geom = ol.geom,
    LineString = _ol$geom.LineString,
    MultiLineString = _ol$geom.MultiLineString,
    Point = _ol$geom.Point;
var _ol2 = ol,
    Feature = _ol2.Feature;
var nutsStack = [];
var brevetVisibles = false;
var map;

var $ = function $(e) {
  return document.querySelectorAll(e);
};

window.onload = function (_) {
  $('table#listNuts tfoot tr td button, table#listBrevets tfoot tr td button').forEach(function (elt) {
    return elt.onclick = function (_) {
      return backBtn();
    };
  });
  map = new CustomMap($('div#map')[0]);
  listNuts();
  fetchGeoJSON();
};

function updateTbody(nuts) {
  var tbody = $('table#listNuts tbody')[0];
  tbody.innerHTML = "";
  var total = nuts.reduce(function (total, n) {
    var tr = document.createElement('tr');
    tr.innerHTML = "<td>".concat(n.code, "</td>\n                        <td>").concat(n.label, "</td>\n                        <td>").concat(n.nb_subnut, "</td>\n                        <td><button>Add</button></td>\n                        <td><button>F</button></td>\n\t\t\t\t\t\t<td><label>").concat(brevetsCache[n.code].length, "</label></td>\n\t\t\t\t        <td><button>Liste de brevets</button></td>");

    tr.children[4].children[0].onclick = function (_) {
      return listNuts(n.code, n.level + 1);
    };

    tr.children[6].children[0].onclick = function (_) {
      return displayListBrevets(brevetsCache[n.code]);
    };

    if (n.has_gps) {
      tr.children[3].children[0].onclick = function (_) {
        map.showKML("".concat(server_url, "/api/getGeometry/").concat(n.code), n.code);
        addVec(n.code, function (_) {
          return map.hideKML(n.code);
        });
      };

      tr.onmouseenter = function (_) {
        return map.highlight(n.code, brevetsCache[n.code].length);
      };

      tr.onmouseleave = function (_) {
        return map.unhighlight(n.code);
      };
    } else {
      tr.children[3].children[0].onclick = function (_) {
        return alert("No gps for this NUTS");
      };

      tr.style.backgroundColor = '#FF000033';
    }

    tbody.append(tr);
    return total + n.nb_subnut;
  }, 0);
  $('td#totalNuts')[0].innerHTML = nuts.length;
  $('td#totalSubNuts')[0].innerHTML = total;
}

function backBtn() {
  if (brevetVisibles) {
    brevetVisibles = false;
    $('table#listNuts')[0].style.visibility = 'visible';
    $('table#listBrevets')[0].style.visibility = 'hidden';
    return;
  }

  if (nutsStack.length == 1) {
    alert('Déja à la racine !');
    return;
  }

  nutsStack.pop();
  updateTbody(nutsStack[nutsStack.length - 1]);
}

function addVec(name, onRemoveCallback) {
  var tr = document.createElement('tr');
  var htmlSafeName = name.replace(' ', '-'); // WARN: It's not the best way safety wise

  tr.id = "layer".concat(htmlSafeName);
  tr.innerHTML = "<td>".concat(name, "</td><td><button>X</button></td>");

  tr.children[1].children[0].onclick = function (_) {
    onRemoveCallback();
    $('table#listOverlay tbody tr#layer' + htmlSafeName)[0].remove();
  };

  $('table#listOverlay tbody')[0].append(tr);
}

function displayListBrevets(liste) {
  console.log("liste: " + liste);
  brevetVisibles = true;
  $('table#listNuts')[0].style.visibility = 'hidden';
  $('table#listBrevets')[0].style.visibility = 'visible';
  var tbody = $('table#listBrevets tbody')[0];
  tbody.innerHTML = "";
  liste.forEach(function (n) {
    var tr = document.createElement('tr');
    tr.innerHTML = "<td>".concat(n.appln_id, "</td>\n                            <td>").concat(n.person_name, "</td>\n                            <td>").concat(n.appln_title, "</td>\n                            <td>").concat(n.appln_filing_date, "</td>");
    tbody.append(tr);
  });
}
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "65094" + '/');

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
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","assets/js/index.js"], null)
//# sourceMappingURL=/js.5c615dc2.js.map