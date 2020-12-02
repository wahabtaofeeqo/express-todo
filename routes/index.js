var express = require('express');
var router = express.Router();
var passport = require('passport');
var controller = require('../controllers/IndexController');
var userController = require('../controllers/UserController');

var isAuthenticated = require('../utils/authenticate');

var title = 'Todo App in Express';

/* GET home page. */
router.get('/', isAuthenticated, controller.home);

router.get('/delete/:id', isAuthenticated, controller.delete);

router.post('/todo', isAuthenticated, controller.todo);

router.get('/login', function(req, res) {
	if (req.user) {
		res.redirect('/');
	}
	else {
		res.render('login', {title: title});
	}
});

router.post('/login', passport.authenticate('local', 
	{successRedirect: '/', failureRedirect: '/login'}));


router.get('/register', function(req, res) {
	if (req.user) {
		res.redirect('/');
	}
	else {
		res.render('register', {title: title});
	}
});

router.post('/register', userController.register);

router.get('/logout', function(req, res) {
	
	req.session.destroy(function(err) {
		if (err) {
			throw err;
		}
		else {
			res.send("done");
		}
	})
});

// Facebook
router.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email']}));
router.get('/auth/facebook/callback', passport.authenticate('facebook', {successRedirect: '/',failureRedirect: '/login'}));

//Google
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/login', successRedirect: '/' }));

//LinkedIn
router.get('/auth/linkedin', passport.authenticate('linkedin'), function(req, res) {});
router.get('/auth/linkedin/callback', passport.authenticate('linkedin', {successRedirect: '/', failureRedirect: '/login'}));

//Twitter
router.get('/auth/twitter', function(req, res, next) {})

module.exports = router;