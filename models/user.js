const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const UserSchema = new Schema({
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

UserSchema.statics.findOrCreate = async function(profile, callback) {

	var user;
	switch(profile.provider) {
		case 'facebook': 
			user = await this.findOne({facebookID: profile.id});
			if (!user) {
				user = this.createUser('facebookID', profile);
			}

			callback(user);
			break;

		case 'google':
			user = await this.findOne({googleID: profile.id});
			if (!user) {
				user = this.createUser('googleID', profile);
			}

			callback(user);
			break;

		case 'linkedin':
			user = await this.findOne({linkedInID: profile.id});
			if (!user) {
				user = this.createUser('linkedInID', profile);
			}

			callback(user);
			break;

		default: 
			callback(null);
	}
}

UserSchema.statics.createUser = async function(provider, profile) {
	const user = new this({
		fullname: profile.name.familyName + " " + profile.name.givenName,
		email: profile.emails[0].value,
		provider: profile.id,
		password: '',
		created: new Date()
	});

	await user.save();
	return user;
}

const User = mongoose.model('users', UserSchema);
module.exports = User;