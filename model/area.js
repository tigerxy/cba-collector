var mongoose = require('mongoose');

exports.list = function list(callback) {
    var Area = mongoose.model('Area');
    /*var a = new Area();
    a.geometry.coordinates = [[[11.0969757,49.7157427],[11.0948514,49.7153404],[11.0907744,49.7148131],[11.0876845,49.7145218],[11.0851311,49.7146883],[11.0790156,49.7155762],[11.0784577,49.7146050],[11.0808395,49.7139113],[11.0882853,49.7129956],[11.0896157,49.7132453],[11.0916113,49.7132037],[11.0925983,49.7119688],[11.0948943,49.7125793],[11.0956882,49.7134812],[11.0955166,49.7139113],[11.0974907,49.7147160],[11.0969757,49.7157427]]];
    a.properties.name = "Südliche Bayreuther";
    a.properties.number = 42;
    a.save();*/

    Area.find({},
        function (err, areas) {
            if (err) {
                console.error(err);
            } else {
                console.log(areas);
                callback("", areas);
            }
        });
}; // end exports.list