var express = require('express');
var router = express.Router();
var db = require('../db');

/* GET login page */
router.get('/new', function(req, res) {
  	res.render('sessions/new', {});
});

/* POST create session (login) */
// No longer vulnerable to an injection attack
router.post('/', function(req, res) {
	console.log(req.body);

	// Sanitize username and password inputs
	var username = req.body.username
	if (typeof username === "object") {
		username = JSON.stringify(username);
	}

	var password = req.body.password
	if (typeof password === "object") {
		password = JSON.stringify(password);
	}

	users = db.get('users');
	users.findOne({
		"username": username,
		"password": password
	}, function (err, user) {
		if (err) {
			res.render('error', {
				message: err.message,
				error:err
			});
		}
		if (user) {
			req.session.userId = user._id;
		}
		res.redirect('/'); 
	});

});

/* GET logout (GET is bad practice for logouts, did it just for speed) */
router.get('/logout', function(req, res) {
	if (req.currentUser) {
    	delete req.session.userId;
  	}
  	res.redirect('/'); 
})

module.exports = router;
