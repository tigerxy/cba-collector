var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'CBA' });
});

router.post('/', function(req, res, next) {
  var token = req.body.token;
  if (token != undefined)
    res.redirect('/map/'+req.body.token);
  else
    res.redirect('/');
});

module.exports = router;
