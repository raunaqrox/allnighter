var mongoose = require('mongoose'),
 	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var commentSchema = new Schema({
  body: String,
  _creator: { type: ObjectId, required: true},
  _creatorName : { type: String, required: true},
  topic: { type: ObjectId},
  replies: [{type: ObjectId, ref: 'Comment'}],
  addedOn: { type: Date, default: Date.Now }
});

//commentSchema.index({ title : 2, description : 1});

module.exports = mongoose.model('Comment', commentSchema);
