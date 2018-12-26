var mongoose = require('mongoose');
exports.add = function add(creator, size, coordinates, callback) {
    var TreeSpot = mongoose.model('TreeSpot');
    var spot = new TreeSpot;
    spot.geometry.coordinates = coordinates;
    spot.properties.creator = creator;
    spot.properties.size = size;
    spot.save(function (err) {
        if (err) {
            console.error(err);
            callback(false)
        } else {
            callback(true);
        }
    });
}; // end exports.add

exports.list = function list(time, callback) {
    var TreeSpot = mongoose.model('TreeSpot');
    TreeSpot.find({
        'properties.created': { $gte: time }
    }, function (err, treespots) {
        if (err) {
            console.error(err);
        } else {
            console.log(treespots);
            callback("", treespots);
        }
    });
}; // end exports.list

exports.listAll = function listAll(callback) {
    var TreeSpot = mongoose.model('TreeSpot');
    TreeSpot.find({},
        function (err, treespots) {
            if (err) {
                console.error(err);
            } else {
                console.log(treespots);
                callback("", treespots);
            }
        });
}; // end exports.list