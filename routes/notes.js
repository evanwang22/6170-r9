var express = require('express');
var router = express.Router();
var db = require('../db');

/* GET notes index */
router.get('/', function(req, res) { 	
	var notes_db = db.get('notes');
  	notes_db.find({}, function(e, notes){
		res.render('notes/index', {"notes": notes});
  	});
  	
});

router.get('/new', function(req, res) {
	res.render('notes/new', {csrf: req.csrfToken() });
});

/* POST create new note */
router.post('/', function(req, res) {
	var notes_db = db.get('notes');
	var title = req.body.title;
	var text = req.body.text;
	var author = "";

	if (req.currentUser) {
		author = req.currentUser.username;
	}

	notes_db.insert({
		"title": title, 
		"text": text,
		"author": author
	}, function(err, note) {
		if (err) {
			res.render('error', {
				message: err.message,
				error:err
			});
		} else {
			res.redirect('/notes');
		}
	});
});



module.exports = router;