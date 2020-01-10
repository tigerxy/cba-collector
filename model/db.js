var events = require('events');
var mongoose = require('mongoose');
var uid = require('rand-token').uid;

var areaSchema = new mongoose.Schema({
    type: { type: String, default: "Feature" },
    geometry: {
        type: { type: String, default: "Polygon" },
        coordinates: [[[Number]]]
    },
    properties: {
        number: Number,
        name: String,
        user: mongoose.Schema.Types.ObjectId
    }
});
var treeSpotSchema = new mongoose.Schema({
    type: { type: String, default: "Feature" },
    geometry: {
        type: { type: String, default: "Point" },
        coordinates: [Number]
    },
    properties: {
        size: Number,
        collector: mongoose.Schema.Types.ObjectId,
        status: [
            {
                user: mongoose.Schema.Types.ObjectId,
                time: { type: Date, default: Date.now() },
                action: String
            }
        ]
    }
});
var userSchema = new mongoose.Schema({
    token: { type: String, default: function () { return uid(9) } },
    name: String,
    collector: { type: Boolean, default: false },
    admin: { type: Boolean, default: false }
});
mongoose.model('User', userSchema);
mongoose.model('Area', areaSchema);
var tree = mongoose.model('TreeSpot', treeSpotSchema);
mongoose.connect(process.env.MONGODB_CONN_STR);

var e = new events.EventEmitter();
tree.watch().on('change', function (data) {
    console.log('emit db.js');
    e.emit('db', [data]);
});
module.exports = e;
