var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/:token', function (req, res, next) {
  var revision = require('child_process')
    .execSync('git rev-parse --short HEAD')
    .toString().trim();
  res.render('map', { title: "CBA", token: req.params.token, git: revision });
});

module.exports = router;
