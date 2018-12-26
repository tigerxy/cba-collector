var mongoose = require('mongoose');
var areaSchema = new mongoose.Schema({
    type: { type: String, default: "Feature" },
    geometry: {
        type: { type: String, default: "Polygon" },
        coordinates: [[[Number]]]
    },
    properties: {
        number: Number,
        name: String
    }
});
var treeSpotSchema = new mongoose.Schema({
    type: { type: String, default: "Feature" },
    geometry: {
        type: { type: String, default: "Point" },
        coordinates: [Number]
    },
    properties: {
        created: { type: Date, default: Date.now() },
        size: Number,
        creator: String,
        pickedup: { type: Boolean, default: false },
        assinged: { type: Boolean, default: false }
    }
});
mongoose.model('Area', areaSchema);
mongoose.model('TreeSpot', treeSpotSchema);
mongoose.connect('mongodb+srv://roland:8QA2G2BzvMMNFMUw@clustercba-pvsux.mongodb.net/cba');  