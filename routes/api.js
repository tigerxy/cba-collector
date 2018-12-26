var express = require('express');
var router = express.Router();
var TreeSpot = require('../model/treeSpot');

/* GET home page. */
router.get('/', function (req, res, next) {
    TreeSpot.listAll(function (err, treespots) {
        res.setHeader('Content-Type', 'application/json');
        res.send(treespots);
    });
});

router.post('/', function (req, res, next) {
    var token = req.body.token;
    var size = req.body.size;
    var point = [req.body.lon,req.body.lat];
    
    TreeSpot.add(token,size,point,function (success) {
        res.setHeader('Content-Type', 'application/text');
        res.status(success?200:500).send(success);
    });
});

module.exports = router;
