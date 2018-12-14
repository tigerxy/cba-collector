var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/:token', function(req, res, next) {
  res.render('map', { title: "CBA", token: req.params.token });
});

module.exports = router;
