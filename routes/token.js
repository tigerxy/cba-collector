var express = require('express');
var fs = require('fs');
var router = express.Router();

/* GET users listing. */
router.get('/:token', function (req, res, next) {
  var revision = fs.readFileSync('.git/HEAD').toString();
  if (revision.indexOf(':') != -1) {
    revision = fs.readFileSync('.git/' + revision.substring(5).trim()).toString();
  }
  res.render('map', { title: "CBA", token: req.params.token, git: revision });
});

module.exports = router;
