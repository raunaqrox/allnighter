var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var typeSchema = new Schema({
	title: {type:String, unique: true, required: true},
	addedOn: { type: Date, default: Date.Now }
});

module.exports = mongoose.model('Type', typeSchema);