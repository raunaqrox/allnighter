var mongoose = require('mongoose'),
 	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var ratingSchema = new Schema({
  topic: ObjectId,
  userWhoVoted: [ObjectId],
  addedOn: { type: Date, default: Date.Now }
});


module.exports = mongoose.model('Rating', ratingSchema);
