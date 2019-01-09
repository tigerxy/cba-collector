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

exports.collect = function collect(id, user, callback) {
    var TreeSpot = mongoose.model('TreeSpot');
    TreeSpot.findById(id, function (err, tree) {
        if (err) {
            callback(err, tree);
        }
        else if (new String(tree.properties.collector).valueOf() != new String(user._id).valueOf()) {
            callback('Not assigned as collector', null);
        } else {
            tree.properties.status.push(
                {
                    user: user._id,
                    time: Date.now(),
                    action: 'collected'
                }
            );
            tree.save(callback);
        }
    });
};

exports.assign = function assign(id, user, userid, callback) {
    var TreeSpot = mongoose.model('TreeSpot');
    TreeSpot.findById(id, function (err, tree) {
        if (err) {
            callback(err, tree);
        }
        else {
            tree.properties.collector = userid;
            tree.properties.status.push(
                {
                    user: user._id,
                    time: Date.now(),
                    action: 'assigned'
                }
            );
            tree.save(callback);
        }
    });
};

exports.listNewest = function listNewest(user, time, callback) {
    var TreeSpot = mongoose.model('TreeSpot');
    TreeSpot.aggregate([
        {
            $match: {
                'properties.status.time': {
                    $gte: time
                }
            }
        },
        {

            $addFields: {
                'properties.yours': {
                    $eq: ['$properties.collector', user._id]
                }
            }
        }
    ]).exec(callback);;
}; // end exports.list

exports.list = function list(user, callback) {
    var TreeSpot = mongoose.model('TreeSpot');
    //TreeSpot.find({}, callback);
    TreeSpot.aggregate([
        {
            $addFields: {
                'properties.yours': {
                    $eq: ['$properties.collector', user._id]
                }
            }
        }
    ]).exec(callback);
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