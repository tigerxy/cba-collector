var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    var out = { test: 'token' };
    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify(out));
});

module.exports = router;
