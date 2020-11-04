const mongoose = require('mongoose');

var Schema = mongoose.Schema;
var UserSchema = new Schema({
	fullname: {type: String, required: true},
	email: String,
	password: String,
	created: Date,
	updated: Date
});

UserSchema.virtual('url').get(function() {
	return '/users/' + this._id;
});

const User = mongoose.model('users', UserSchema);
module.exports = User;