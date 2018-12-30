var express = require('express');
var router = express.Router();
var Area = require('../model/area');
var TreeSpot = require('../model/treeSpot');


/* GET home page. */
router.get('/areas', function (req, res, next) {
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

router.ws('/ws', function (ws, req) {
    /*console.log('Websocket connected');
    ws.on('open', function (ws) {
        console.log('connected');
        TreeSpot.watch().on('change', data => ws.send(data));
    });
    ws.on('message', function (ws, msg) {
        console.log(Date.now().toLocaleString(), msg);
    });*/
    //TreeSpot.watch().on('change', data => ws.send(data));
    //ws.on(, function (ws) {
        //TreeSpot.addWebsocket(function (data) { ws.send(data); });
        Area.list(function (err, areas) {
            ws.send(JSON.stringify(areas.map(obj => {
                return {
                    "operationType": "insert",
                    "fullDocument": obj,
                    "ns": {
                        "db": "cba",
                        "coll": "areas"
                    }
                }
            })));
        });
        TreeSpot.list(0,function (err, treespots) {
            ws.send(JSON.stringify(treespots.map(obj => {
                return {
                    "operationType": "insert",
                    "fullDocument": obj,
                    "ns": {
                        "db": "cba",
                        "coll": "treespots"
                    }
                }
            })));
        });
    //});
    ws.on('message', function (msg) {
        ws.send(msg);
    });
});

module.exports = router;
