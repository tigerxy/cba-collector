var mongoose = require('mongoose');

exports.findUser = function findUser(token, callback) {
    var User = mongoose.model('User');
    User.findOne({ token: token }, callback);
};

exports.isAdmin = function isAdmin(token, callback) {
    var User = mongoose.model('User');
    User.count({token:token,admin:true},function(err,count) {
        callback(err,count > 0);
    });
};

exports.userId = function userId(token, callback) {
    exports.findUser(token, function (err, res) {
        if (err == null) {
            callback(null, res._id);
        } else {
            console.log(err);
            callback(err, null);
        }
    });
};

exports.list = function list(callback) {
    var User = mongoose.model('User');
    /*var u = new User();
    u.token = 'asdf';
    u.admin = true;
    u.description = 'Test Admin Roland';
    u.save();*/
    User.find({}, {
        token: 0 // exclude token
    }, function (err, res) {
        callback(err, res);
    });
};