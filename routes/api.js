var createError = require('http-errors');
var express = require('express');
var router = express.Router();
var ShareDB = require('sharedb');
const db = require('sharedb-mongo')('mongodb+srv://roland:8QA2G2BzvMMNFMUw@clustercba-pvsux.mongodb.net/cba');
var share = new ShareDB({db});
var WebSocketJSONStream = require('websocket-json-stream');
var User = require('../model/user');
var Area = require('../model/area');
var TreeSpot = require('../model/treeSpot');

var requireAdmin = function (req, res, next) {
    if (req.headers.token === undefined) {
        next(createError(401));
    } else {
        User.isAdmin(req.headers.token, function (err, admin) {
            if (err != null || !admin) {
                next(createError(403));
            } else {
                next();
            }
        });
    }
};

var getUser = function (req, res, next) {
    if (req.headers.token === undefined) {
        next(createError(401));
    } else {
        User.findUser(req.headers.token, function (err, user) {
            if (err != null) {
                next(createError(403));
            } else {
                req.user = user;
                next();
            }
        });
    }
};

/* GET home page. */
router.get('/area', getUser, function (req, res, next) {
    Area.list(req.user, function (err, areas) {
        if (err != null) {
            next(createError(404));
        } else {
            res.json(areas);
        }
    });
});

router.get('/tree', getUser, function (req, res, next) {
    var sec = req.query.time == undefined ? 0 : parseInt(req.query.time);
    var time = new Date(sec == NaN ? 0 : sec);
    TreeSpot.listNewest(req.user, time, function (err, treespots) {
        if (err != null) {
            next(createError(404));
        } else {
            res.json(treespots);
        }
    });
});

router.post('/tree', getUser, function (req, res, next) {
    var size = req.body.size;
    var point = [Number(req.body.lon), Number(req.body.lat)];

    TreeSpot.add(req.user, size, point, function (err, doc) {
        if (err == null) {
            res.json(doc);
        } else {
            next(createError(404));
        }
    });
});

router.get('/tree/:id', function (req, res, next) {
    TreeSpot.get(req.params.id, function (err, doc) {
        if (err == null) {
            res.json(doc);
        } else {
            next(createError(404));
        }
    });
});

// Collect
router.post('/tree/:id', getUser, function (req, res, next) {
    TreeSpot.collect(req.params.id, req.user, function (err, doc) {
        if (err == null) {
            res.json(doc);
        } else {
            next(createError(404));
        }
    });
});

// Assign
router.post('/tree/:id/:userid', requireAdmin, getUser, function (req, res, next) {
    TreeSpot.assign(req.params.id, req.user, req.params.userid, function (err, doc) {
        if (err == null) {
            res.json(doc);
        } else {
            next(createError(404));
        }
    });
});

router.delete('/tree/:id', getUser, function (req, res, next) {
    TreeSpot.remove(req.params.id, req.user, function (err, r) {
        if (err != null) {
            next(createError(404));
        } else {
            res.json(r);
        }
    });
});

router.get('/user', requireAdmin, function (req, res, next) {
    User.list(function (err, userlist) {
        if (err != null) {
            next(createError(404));
        } else {
            res.json(userlist);
        }
    });
});

router.get('/user/collectors', requireAdmin, function (req, res, next) {
    User.listCollectors(function (err, userlist) {
        if (err != null) {
            next(createError(404));
        } else {
            res.json(userlist);
        }
    });
});

router.ws('/ws', function (ws, req) {
    // 'ws' is a websocket server connection, as passed into
    // new (require('ws').Server).on('connection', ...)
    var stream = new WebSocketJSONStream(ws);
    share.listen(stream);
});

module.exports = router;
