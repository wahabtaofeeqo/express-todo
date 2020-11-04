var express = require('express');
var router = express.Router();
var controller = require('../controllers/IndexController');
var userController = require('../controllers/UserController');


var title = 'Todo App in Express';

/* GET home page. */
router.get('/', controller.home);

router.get('/delete/:id', controller.delete);

router.post('/todo', controller.todo);

router.get('/login', function(req, res) {
	if (req.session.user_id) {
		res.redirect('/');
	}
	else {
		res.render('login', {title: title});
	}
});


router.post('/login', userController.login);


router.get('/register', function(req, res) {
	if (req.session.user_id) {
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

module.exports = router;