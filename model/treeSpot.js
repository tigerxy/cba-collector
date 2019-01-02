var mongoose = require('mongoose');
exports.add = function add(user, size, coordinates, callback) {
    var TreeSpot = mongoose.model('TreeSpot');
    TreeSpot.create({
        geometry: {
            coordinates: coordinates
        },
        properties: {
            size: size,
            status: [{
                user: user._id,
                time: Date.now(),
                action: 'add'
            }]
        }
    }, callback);
}; // end exports.add

exports.get = function get(id, callback) {
    var TreeSpot = mongoose.model('TreeSpot');
    TreeSpot.findById(id, callback);
};

exports.listNewest = function listNewest(time, callback) {
    var TreeSpot = mongoose.model('TreeSpot');
    TreeSpot.find({
        'properties.status.time': { $gte: time }
    }, callback);
}; // end exports.list

exports.list = function list(callback) {
    var TreeSpot = mongoose.model('TreeSpot');
    TreeSpot.find({}, callback);
}; // end exports.list

exports.remove = function remove(id, user, callback) {
    var TreeSpot = mongoose.model('TreeSpot');
    if (user.admin) {
        TreeSpot.findOneAndDelete({ _id: id }, callback);
    } else {
        TreeSpot.findOneAndUpdate({ _id: id }, {
            $addToSet: {
                'properties.status': {
                    user: user._id,
                    time: Date.now(),
                    action: 'remove'
                }
            }
        },
            { returnOriginal: false },
            callback);
    }
};

exports.addWebsocket = function addWebsocket(callback) {
    var TreeSpot = mongoose.model('TreeSpot');
    TreeSpot.watch().on('change', data => callback(data));
}