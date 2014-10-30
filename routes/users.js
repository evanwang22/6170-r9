var express = require('express');
var router = express.Router();
var db = require('../db');

/* GET user signup */
router.get('/new', function(req, res) {
  res.render('users/new', {});
});

/* POST create user */
router.post('/', function(req, res, next) {
  	var users = db.get('users');
	users.insert({"username": req.body.username, "password": req.body.password}, function(err, docs){
		if(err){
			res.send("There was a problem");
		}else{
			res.redirect("../");
		}
	});
});

module.exports = router;
