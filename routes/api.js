var express = require('express');
var router = express.Router();
var Area = require('../model/area');
var TreeSpot = require('../model/treeSpot');

/* GET home page. */
router.get('/area', function (req, res, next) {
    Area.list(function (err, areas) {
        res.setHeader('Content-Type', 'application/json');
        res.send(areas);
    });
});

router.get('/tree', function (req, res, next) {
    var sec = req.query.time == undefined ? 0 : parseInt(req.query.time);
    var time = new Date(sec == NaN ? 0 : sec);
    TreeSpot.list(time, function (err, treespots) {
        res.setHeader('Content-Type', 'application/json');
        res.send(treespots);
    });
});

router.post('/tree', function (req, res, next) {
    var token = req.body.token;
    var size = req.body.size;
    var point = [Number(req.body.lon), Number(req.body.lat)];

    TreeSpot.add(token, size, point, function (success) {
        res.setHeader('Content-Type', 'application/text');
        res.status(success ? 200 : 500).send(success);
    });
});

module.exports = router;
