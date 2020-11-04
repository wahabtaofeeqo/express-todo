var Todo = require('../models/todo');
var User = require('../models/user');

var title = 'Todo App in Express';


exports.login = function(req, res, next) {
	var formData = req.body;

	User.findOne({email: formData.email, password: formData.password}, function(err, user) {
		if (err) throw err;
		
		if (!user) {
			res.render('login', {title: title, reason: 'Username OR Password not Correct'})
		}
		else {
			req.session.user_id = user._id;
			req.session.name = user.fullname;

			res.redirect('/')
		}
	})
}

exports.register = function(req, res, next) {

	var formData = req.body;
	var newUser = new User({fullname: formData.name, email: formData.email, password: formData.password, created: new Date()});
	newUser.save(function(err, response) {
		if (err) throw err;
		res.redirect('/login');
	});
}