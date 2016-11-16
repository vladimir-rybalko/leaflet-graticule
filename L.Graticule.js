/*
 Graticule plugin for Leaflet. Original plugin https://github.com/turban/Leaflet.Graticule
*/
L.Graticule = L.GeoJSON.extend({

    options: {
        style: {
            color: '#333',
            weight: 1
        },
        interval: 20
    },

    initialize: function (options) {
        L.Util.setOptions(this, options);
        this._layers = {};

        if (this.options.sphere) {
            this.addData(this._getFrame());
        } else {
            this.addData(this._getGraticule());
        }
    },

    setInterval: function (interval) {
        if (interval !== this.options.interval) {
            this.options.interval = interval;
        }
    },

    setExtent: function(latLngBounds) {
        if (!latLngBounds.equals(this.options.extent)) {
            this.options.extent = latLngBounds;
        }
    },

    refresh: function() {
        this.clearLayers();
        this.initialize(this.options);
    },

    _getFrame: function() {
        return { "type": "Polygon",
          "coordinates": [
              this._getMeridian(-180).concat(this._getMeridian(180).reverse())
          ]
        };
    },

    _getGraticule: function () {
        var features = [], interval = this.options.interval;
        var extent = this.options.extent;
        for (var lng = 0; lng <= 180; lng = lng + interval) {
            if (extent) {
                if (lng > extent.getWest() && lng < extent.getEast()) {
                    features.push(this._getFeature(this._getMeridian(lng), {
                        "name": (lng) ? lng.toString() + "° E" : "0°"
                    }));
                }
                if (lng !== 0 && -lng > extent.getWest() && -lng < extent.getEast()) {
                    features.push(this._getFeature(this._getMeridian(-lng), {
                        "name": lng.toString() + "° W"
                    }));
                }
            } else {
                features.push(this._getFeature(this._getMeridian(lng), {
                    "name": (lng) ? lng.toString() + "° E" : "0°"
                    
                }));
                if (lng !== 0) {
                    features.push(this._getFeature(this._getMeridian(-lng), {
                        "name": lng.toString() + "° W"
                    }));
                }
            }
        }

        for (var lat = 0; lat <= 90; lat = lat + interval) {
            if (extent) {
                if (lat > extent.getSouth() && lat < extent.getNorth()) {
                    features.push(this._getFeature(this._getParallel(lat), {
                        "name": (lat) ? lat.toString() + "° N" : "0°"
                    }));
                }
                if (lat !== 0 && -lat > extent.getSouth() && -lat < extent.getNorth()) {
                    features.push(this._getFeature(this._getParallel(-lat), {
                        "name": lat.toString() + "° S"
                    }));
                }
            } else {
                features.push(this._getFeature(this._getParallel(lat), {
                    "name": (lat) ? lat.toString() + "° N" : "0°"
                }));
                if (lat !== 0) {
                    features.push(this._getFeature(this._getParallel(-lat), {
                        "name": lat.toString() + "° S"
                    }));
                }
            }
        }

        return {
            "type": "FeatureCollection",
            "features": features
        };
    },

    _getMeridian: function (lng) {
        lng = this._lngFix(lng);
        var coords = [];
        for (var lat = -90; lat <= 90; lat++) {
            coords.push([lng, lat]);
        }
        return coords;
    },

    _getParallel: function (lat) {
        var coords = [];
        for (var lng = -180; lng <= 180; lng++) {
            coords.push([this._lngFix(lng), lat]);
        }
        return coords;
    },

    _getFeature: function (coords, prop) {
        return {
            "type": "Feature",
            "geometry": {
                "type": "LineString",
                "coordinates": coords
            },
            "properties": prop
        };
    },

    _lngFix: function (lng) {
        if (lng >= 180) return 179.999999;
        if (lng <= -180) return -179.999999;
        return lng;
    }

});

L.graticule = function (options) {
    return new L.Graticule(options);
};
