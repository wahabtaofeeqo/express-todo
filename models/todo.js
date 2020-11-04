const mongoose = require('mongoose');
const { DateTime } = require('luxon');

var Schema = mongoose.Schema;
var TodoSchema = new Schema({
	name: {type: String, required: true},
	user: {type: Schema.Types.ObjectId, ref: 'users'},
	date: Date
});

TodoSchema.virtual('url').get(function() {
	return '/todos/' + this._id;
});

TodoSchema.virtual('created').get(function() {
	return DateTime.fromJSDate(this.date).toLocaleString(DateTime.DATE_MED);
})

const Todo = mongoose.model('todos', TodoSchema);
module.exports = Todo;