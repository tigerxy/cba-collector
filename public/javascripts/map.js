var TreeIcon = (function () {
    function TreeIcon(color) {
        this.icon = new L.Icon({
            iconUrl: '/images/tree_' + color + '.png',
            iconSize: [30, 35],
            iconAnchor: [15, 35],
            popupAnchor: [0, -37]
        });
    }
    TreeIcon.prototype.get = function () {
        return this.icon;
    };
    return TreeIcon;
}());
var leafletmap = (function () {
    function leafletmap(id) {
        this.bounds = null;
        this.greenIcon = new TreeIcon('green');
        this.yellowIcon = new TreeIcon('yellow');
        this.redIcon = new TreeIcon('red');
        this.greyIcon = new TreeIcon('grey');
        this.map = L.map(id).fitWorld();
        this.addRights();
        this.addLocationPosition();
        this.configAreas();
        this.configTrees();
    }
    leafletmap.prototype.addRights = function () {
        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
            maxZoom: 18,
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
                '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            id: 'mapbox.streets'
        }).addTo(this.map);
    };
    leafletmap.prototype.addLocationPosition = function () {
        this.gpsPosition = L.circle([51, 9], { radius: 1500000 });
        this.gpsPosition.addTo(this.map);
        this.map.locate({ watch: true, enableHighAccuracy: true });
        this.map.on('locationfound', this.onLocationFound);
        this.map.on('locationerror', this.onLocationError);
    };
    leafletmap.prototype.onLocationFound = function (e) {
        var radius = e.accuracy / 2;
        console.log(this);
        this.gpsPosition.setLatLng(e.latlng);
        this.gpsPosition.setRadius(radius);
    };
    leafletmap.prototype.onLocationError = function (e) {
        alert('danger', e.message);
    };
    leafletmap.prototype.configAreas = function () {
        this.areas = L.geoJSON([], {
            style: function (feature) {
                if (feature.properties.yours) {
                    return {
                        color: 'red',
                        fill: false
                    };
                }
                else {
                    return {
                        color: 'gray',
                        opacity: 0.5,
                        fill: true,
                        fillColor: 'gray'
                    };
                }
            },
            onEachFeature: function (feature, layer) {
                if (feature.properties.yours) {
                    this.bounds = layer.getBounds();
                }
            }
        });
        this.areas.addTo(this.map);
    };
    leafletmap.prototype.addAreas = function (geojson) {
        this.trees.addData(geojson);
        this.map.fitBounds(this.bounds == null ? this.areas.getBounds() : this.bounds);
    };
    leafletmap.prototype.configTrees = function () {
        this.trees = L.geoJSON([], {
            pointToLayer: function (feature, latlng) {
                var icon;
                switch (feature.properties.status[feature.properties.status.length - 1].action) {
                    case 'remove':
                        icon = this.redIcon.get();
                        break;
                    case 'add':
                        icon = this.greenIcon.get();
                        break;
                    default:
                        icon = this.greyIcon.get();
                        break;
                }
                return L.marker(latlng, { icon: icon });
            },
            onEachFeature: function onEachFeature(feature, layer) {
                layer.on('click', function () { onOpenEdit(layer, feature); });
            }
        });
        this.trees.addTo(this.map);
    };
    leafletmap.prototype.addTrees = function (geojson) {
        this.trees.addData(geojson);
    };
    leafletmap.prototype.getPosition = function () {
        return this.gpsPosition.getLatLng();
    };
    return leafletmap;
}());
var map = new leafletmap('map');
function openDialog(o) {
    $('.dialog').addClass('inactive');
    $('#' + o + 'Dialog').removeClass('inactive');
}
function onOpenDialog(e) {
    var o = e.target.attributes.open.nodeValue;
    openDialog(o);
}
function onOpenEdit(layer, feature) {
    console.log(feature);
    openDialog('edit');
}
function alert(type, message) {
    var html = '<div class="alert alert-' + type + ' alert-dismissible" role="alert">' +
        '   <strong>' + message + '</strong>' +
        '       <button class="close" type="button" data-dismiss="alert" aria-label="Close">' +
        '           <span aria-hidden="true">&times;</span>' +
        '       </button>';
    '   </div>';
    var elem = $(html);
    elem.appendTo('#alert');
    setTimeout(function (e) { $(e[0]).alert('close'); }, 5000, elem);
}
$.ajaxSetup({
    headers: {
        token: token
    }
});
function onAddTrees(event) {
    $.post("/api/tree", {
        size: 1,
        lon: event.data.lng,
        lat: event.data.lat
    })
        .done(function () {
        alert('success', 'Haufen erfolgreich hinzugefügt.');
    })
        .fail(function () {
        alert('danger', 'Fehler');
    })
        .always(function () {
        openDialog('main');
    });
}
function loadAreas() {
    $.getJSON("/api/area", function () { })
        .done(function (data) {
        console.log(data);
        map.addAreas(data);
    })
        .fail(function (err) {
        console.error(err.message);
    })
        .always(function () {
    });
}
function loadTrees(time) {
    if (time === void 0) { time = 0; }
    $.getJSON("/api/tree?time=" + time, function () { })
        .done(function (data) {
        console.log(data);
        data.length > 0 ? map.addTrees(data) : 0;
    })
        .fail(function (err) {
        console.error(err.message);
    })
        .always(function () {
        time = Date.now();
        setTimeout(function () {
            loadTrees(time);
        }, 30000);
    });
}
loadAreas();
loadTrees();
$('#add').on("click", map.getPosition(), onAddTrees);
$('.openDialog').on("click", onOpenDialog);
//# sourceMappingURL=map.js.map