var title = 'Todo App in Express';

module.exports = (req, res, next) => {
	if (req.user) {
		return next();
	}
	else {
		return res.render('login', {title: title, message: "You must login to continue"});
	}
}