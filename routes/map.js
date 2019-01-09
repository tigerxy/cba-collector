var express = require('express');
var router = express.Router();
var User = require('../model/user');

var getUser = function (req, res, next) {
  User.findUser(req.params.token, function (err, user) {
    if (err != null || user == null) {
      req.permissionLevel = 0;
      next();
    } else {
      req.permissionLevel = 1;
      if (user.collector) {
        req.permissionLevel = 2;
      }
      if (user.admin) {
        req.permissionLevel = 3;
      }
      next();
    }
  });
};

/* GET users listing. */
router.get('/:token', getUser, function (req, res, next) {
  res.render('map', { title: "CBA", token: req.params.token, permissionLevel: req.permissionLevel });
});

module.exports = router;
