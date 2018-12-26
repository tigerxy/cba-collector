var mongoose = require('mongoose');
var treeSpotSchema = new mongoose.Schema({
    type: { type: String, default: "Feature" },
    geometry: {
        type: { type: String, default: "Point" },
        coordinates: Array
    },
    properties: {
        created: Date,
        size: Number,
        creator: String,
        pickedup: { type: Boolean, default: false },
        assinged: { type: Boolean, default: false }
    }
});
mongoose.model('TreeSpot', treeSpotSchema);
mongoose.connect('mongodb+srv://roland:8QA2G2BzvMMNFMUw@clustercba-pvsux.mongodb.net/cba');  