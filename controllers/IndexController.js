var Todo = require('../models/todo');
var User = require('../models/user');

var title = 'Todo App in Express';

exports.home = function(req, res, next) {

	Todo.find({ user: req.user._id }).populate('user').exec(function(err, result) {
		if(err) throw err;

		var empty = (result.length == 0) ? true : false; 
		res.render('index', {title: title, todos: result, empty: empty});
	})
}

exports.delete = function(req, res, next) {

	Todo.deleteOne({_id: req.params.id}, function(err, response) {
		if (err) {
			res.send("Could not Delete Todo");
		}

		res.send("Todo Delete Successfully");
	});
}

exports.todo = function(req, res, next) {

	//Form
	var {todo} = req.body;

	console.log(req);
	
	//New Model
	var newTodo = new Todo({name: todo, user: req.user._id, date: new Date()});
	newTodo.save(function(err, response) {
		if (err) throw err;
		res.redirect('/');
	});
}