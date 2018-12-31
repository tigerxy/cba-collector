var mongoose = require('mongoose');
exports.add = function add(user, size, coordinates, callback) {
    var TreeSpot = mongoose.model('TreeSpot');
    var spot = new TreeSpot;
    spot.geometry.coordinates = coordinates;
    spot.properties.size = size;
    spot.properties.status = [{
        user: user._id,
        time: Date.now(),
        action: 'add'
    }];
    spot.save(callback);
}; // end exports.add

exports.get = function get(id,callback) {
    var TreeSpot = mongoose.model('TreeSpot');
    TreeSpot.findById(id,callback);
};

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

exports.remove = function remove(id, user, callback) {
    var TreeSpot = mongoose.model('TreeSpot');
    if (user.admin) {
        TreeSpot.findOneAndDelete({ _id: id }, callback);
    } else {
        TreeSpot.findOneAndUpdate({ _id: id }, {
            $push: {
                user: user._id,
                time: Date.now(),
                action: 'remove'
            }
        }, callback);
    }
};

exports.addWebsocket = function addWebsocket(callback) {
    var TreeSpot = mongoose.model('TreeSpot');
    TreeSpot.watch().on('change', data => callback(data));
}