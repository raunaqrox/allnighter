var mongoose = require('mongoose'),
 	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var linkSchema = new Schema({
  title: { type: String, unique: true, required: true },
  url: { type: String, unique: true, required: true },
  description: String,
  type: String,
  _creator: { type: ObjectId, required: true},
  _creatorName : { type: String, required: true},
  _categoryId: ObjectId,
  _creatorUrl: String,
  _category: String,
  tags: { type: [ String ], index : true },
  ratingSum: {type: Number, default: 0},
  ratingCount: {type: Number, default: 0},
  _rating: {type: ObjectId, ref:'Rating'},
  addedOn: { type: Date, default: Date.Now }
});

linkSchema.index({ title : 3, description : 2, tags:2});

module.exports = mongoose.model('Link', linkSchema);
