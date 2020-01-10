// var ShareDB = require('sharedb/lib/client');
// //var WebSocket = require('reconnecting-websocket');
// import ReconnectingWebSocket from 'reconnecting-websocket';
// var socket = new ReconnectingWebSocket('ws://localhost/api/ws');
// var connection = new ShareDB.Connection(socket);
// /*connection.createSubscribeQuery('treespots', {}, {}, (err, results) => {
//     console.log(results);
// })*/

// var query = connection.createSubscribeQuery('treespots', {});
// query.on('ready', update);
// query.on('changed', update);
// query.on('insert', update);

// function update() {
//     console.log(query.results);
// }

//-------------------------------------
// Map
//-------------------------------------

function alert(type, message) {
    var html = '<div class="alert alert-' + type + ' alert-dismissible" role="alert">' +
        '   <strong>' + message + '</strong>' +
        '       <button class="close" type="button" data-dismiss="alert" aria-label="Close">' +
        '           <span aria-hidden="true">&times;</span>' +
        '       </button>'
    '   </div>';
    var elem = $(html);
    elem.appendTo('#alert');
    setTimeout(function (e) { $(e[0]).alert('close'); }, 5000, elem);
}

function onAddTrees(size, latlng) {
    $.post("/api/tree", {
        size: size,
        lon: latlng.lng,
        lat: latlng.lat
    })
        .done(function () {
            alert('success', 'Haufen erfolgreich hinzugefügt.');
        })
        .fail(function () {
            alert('danger', 'Fehler');
        })
        .always(function () {
            openDialog('main');
            //$('#addModal').modal('hide');
        });
}

function onGetCollectors(selectElem) {
    selectElem.empty();
    $.getJSON("/api/user/collectors", function () { })
        .done(function (data) {
            data.forEach(user => {
                selectElem.append('<option value="' + user._id + '">' + user.name + '</option>');
            });
        })
        .fail(function () {
            alert('danger', 'Fehler');
        })
        .always(function () {

        });
}

function onAssignTrees(id, userid) {
    $.post("/api/tree/" + id + "/" + userid, {})
        .done(function () {
            alert('success', 'Haufen User zugewiesen.');
        })
        .fail(function () {
            alert('danger', 'Fehler');
        })
        .always(function () {

        });
}

function onDeleteTrees(id) {
    $.ajax({
        url: "/api/tree/" + id,
        method: 'delete'
    })
        .done(function () {
            alert('success', 'Haufen erfolgreich gelöscht.');
        })
        .fail(function () {
            alert('danger', 'Fehler');
        })
        .always(function () {
            openDialog('main');
            //$('#addModal').modal('hide');
        });
}

function onCollectTrees(id) {
    $.ajax({
        url: "/api/tree/" + id,
        method: 'post'
    })
        .done(function () {
            alert('success', 'Haufen erfolgreich gesammelt.');
        })
        .fail(function () {
            alert('danger', 'Fehler');
        })
        .always(function () {
            openDialog('main');
            //$('#addModal').modal('hide');
        });
}

function loadAreas(geojson) {
    $.getJSON("/api/area", function () { })
        .done(function (data) {
            var bounds = null;
            /*var geo = L.geoJSON(data, {
                style: function (feature) {
                    if (feature.properties.yours) {
                        return {
                            color: 'red',
                            fill: false
                        };
                    } else {
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
                        bounds = layer.getBounds();
                    }
                }
            });
            geo.addTo(map);*/
            splitAndAddToLayerGroup(geojson, data);
            map.fitBounds(geojson[(geojson[1].getLayers().length > 0) * 1].getBounds());
        })
        .fail(function (err) {
            console.error(err);
        })
        .always(function () {
        });
}

function splitAndAddToLayerGroup(layerGroup, data) {
    data.forEach(item => {
        layerGroup[(true == item.properties.yours || secLevel > 2) * 1].addData(item);
    });
}

function loadTrees(geojson, time = 0) {
    $.getJSON("/api/tree?time=" + time, function () { })
        .done(function (data) {
            if (data.length > 0) {
                console.log(data);
                splitAndAddToLayerGroup(geojson, data);
                data.forEach(t => {
                    $('body').trigger('update', t);
                });
            }
        })
        .fail(function (err) {
            console.error(err.message);
        })
        .always(function () {
            time = Date.now();
            setTimeout(function () {
                loadTrees(geojson, time)
            }, 10000);
        });
}

function onLocationFound(e) {
    var radius = e.accuracy / 2;

    /*L.marker(e.latlng).addTo(map)
        .bindPopup("You are within " + radius + " meters from this point").openPopup();
    L.circle(e.latlng, radius).addTo(map);*/

    //console.log(e.latlng);
    gpsPosition.setLatLng(e.latlng);
    gpsPosition.setRadius(radius);
    //gpsPosition.addTo(map);
}

function onLocationError(e) {
    map.locate({ watch: true, enableHighAccuracy: false });
    console.error(e.message);
    //alert('danger', 'Position konnte nicht ermittelt werden.');
}

$.ajaxSetup({
    headers: {
        token: token
    }
});

var TreeIcon = L.Icon.extend({
    options: {
        iconSize: [30, 35],
        iconAnchor: [15, 35],
        popupAnchor: [0, -37]
    }
});

var greenIcon = new TreeIcon({ iconUrl: '/images/tree_green.png' }),
    yellowIcon = new TreeIcon({ iconUrl: '/images/tree_yellow.png' }),
    redIcon = new TreeIcon({ iconUrl: '/images/tree_red.png' }),
    greyIcon = new TreeIcon({ iconUrl: '/images/tree_grey.png' });

var map = L.map('map').fitWorld();

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);


var gpsPosition = L.circle([51, 9], { radius: 1500000 });
gpsPosition.addTo(map);

var formatMarker = function (feature, latlng) {
    var icon;
    switch (feature.properties.status[feature.properties.status.length - 1].action) {
        case 'remove':
            icon = greyIcon;
            break;
        case 'add':
            icon = redIcon;
            break;
        case 'assigned':
            icon = yellowIcon;
            break;
        case 'collected':
            icon = greenIcon;
            break;
        default:
            icon = greyIcon;
            break;
    }
    return L.marker(latlng, { icon: icon });
}

var formatFeature = function onEachFeature(feature, layer) {
    //layer.bindPopup(feature.properties.creator);
    layer.on('click', function () { openDialog('edit', feature); });
    $('body').on('update', function (e, changeFeature) {
        if (changeFeature._id == feature._id) {
            feature = changeFeature;
            console.log('My ID is ' + changeFeature._id);
        }
    })
}

var myAreasLayerGroup = L.geoJSON([], {
    style: {
        color: 'red',
        fill: true,
        fillOpacity: 0
    },
    onEachFeature: function (feature, layer) {
        if (secLevel > 1) {
            layer.bindTooltip(feature.properties.number + ': ' + feature.properties.name, { sticky: true, interactive: true });
        }
    }
});

var areasLayerGroup = L.geoJSON([], {
    style: {
        color: 'gray',
        opacity: 0.5,
        fill: true,
        fillColor: 'gray'
    }
});

var myTreeLayerGroup = L.geoJSON([], {
    pointToLayer: formatMarker,
    onEachFeature: formatFeature
});

var treeLayerGroup = L.geoJSON([], {
    pointToLayer: formatMarker,
    onEachFeature: formatFeature
});

//var allTrees = L.layerGroup([treePosition]);
L.control.layers({},
    {
        "Mein Gebiet": myAreasLayerGroup,
        "Andere Gebiete": areasLayerGroup,
        "Meine Bäume": myTreeLayerGroup,
        "Andere Bäume": treeLayerGroup
    }).addTo(map);
//$('.leaflet-control-layers-selector').prop("checked", true);
//treePosition.addTo(map);
map.addLayer(myTreeLayerGroup);
if (secLevel != 2) {
    map.addLayer(myAreasLayerGroup);
    map.addLayer(areasLayerGroup);
    map.addLayer(treeLayerGroup);
}



L.easyButton('fa-crosshairs', function (btn, map) {
    map.fitBounds(myAreasLayerGroup.getBounds());
}).addTo(map);

L.easyButton('fa-question', function (btn, map) {
    $('#helpModal').modal('show');
}).addTo(map);

L.easyButton('fa-cog', function (btn, map) {
    $('#settingsModal').modal('show');
}).addTo(map);

loadAreas([areasLayerGroup, myAreasLayerGroup]);
loadTrees([treeLayerGroup, myTreeLayerGroup]);


map.locate({ watch: true, enableHighAccuracy: true });
map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);

//var cross = L.control.centerCross({ show: false });
//map.addControl(cross);
var cross = L.centerCross();
map.addLayer(cross);
cross.setVisible(false);


//-------------------------------------
// Dialogs
//-------------------------------------
function openDialog(dialogName, data) {
    cross.setVisible(false);
    $('.dialog').addClass('inactive');
    $('#' + dialogName + 'Dialog').removeClass('inactive');
    $('body').trigger(dialogName, data);
}

function onOpenDialog(e) {
    var o = e.target.attributes.open.nodeValue;
    openDialog(o);
}



$('.openDialog').on("click", onOpenDialog);
$('body').on('add', function (e) {
    cross.setVisible(true);
    if ($('#flyto').prop('checked')) {
        var gps = gpsPosition.getLatLng();
        console.log(gps.lat,gps.lon,gps);
        if (gps.lat > 49.6 && gps.lat < 49.8 && gps.lon > 11.0 && gps.lon < 11.2) {
            map.flyTo(gpsPosition.getLatLng());
        }
    }
    $('#size label').removeClass('active');
    $('#size label:nth-child(2)').addClass('active');
    $('#add')
        .off()
        .on("click", function (e) {
            onAddTrees($('#size label.active input').prop('id'), map.getCenter());
        });
});
$('body').on('main', function (e) {
});
$('body').on('edit', function (e, feature) {
    console.log(feature);
    if (secLevel >= 3) {
        onGetCollectors($('select#user'));
    }
    var log = $('#editLog');
    log.empty();
    var status = feature.properties.status;
    status.forEach(state => {
        var d = new Date(state.time);
        log.append('<tr><td>' + d.toISOString().slice(11, 16) + '</td><td>' + state.message + '</td></tr>');
    });
    if (secLevel < 3 && status[status.length - 1].action != 'add') {
        $('#delete').prop('disabled', true);
    }
    else {
        $('#delete')
            .prop('disabled', false)
            .off()
            .on("click", function (e) {
                onDeleteTrees(feature._id);
            });
    }
    $('#collect')
        .off()
        .on("click", function (e) {
            onCollectTrees(feature._id);
        });
    $('#assign')
        .off()
        .on("click", function (e) {
            onAssignTrees(feature._id, $('select#user').val());
        });
    console.log(feature.properties.size);
    $('#editSize')
        .prop('aria-valuenow', feature.properties.size)
        .css('width', feature.properties.size * 33 + '%')
        .html(feature.properties.size);
});
