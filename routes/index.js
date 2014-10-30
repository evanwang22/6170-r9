var express = require('express');
var router = express.Router();

/* GET home page deoending on user auth status */
router.get('/', function(req, res) {
	if (!req.currentUser) {
  		res.render('index/index');
  	} else {
  		res.render('index/home', {"username":req.currentUser.username});
  	}
});

module.exports = router;
