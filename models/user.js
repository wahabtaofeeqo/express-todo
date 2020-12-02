const mongoose = require('mongoose');

var Schema = mongoose.Schema;
var UserSchema = new Schema({
	fullname: {type: String, required: true},
	email: String,
	facebookID: String,
	googleID: String,
	linkedInID: String,
	password: String,
	created: Date,
	updated: Date
});

UserSchema.virtual('url').get(function() {
	return '/users/' + this._id;
});

UserSchema.methods.validPassword = function(password) {
	return (this.password == password);
}

UserSchema.methods.findOrCreate = function(user, provider) {
	
}

const User = mongoose.model('users', UserSchema);
module.exports = User;