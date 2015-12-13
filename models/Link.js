var mongoose = require('mongoose'),
 	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var itemSchema = new Schema({
  title: { type: String, unique: true, required: true },
  description: String,
  available: Boolean,
  _categoryId: ObjectId,
  _creatorUrl: String,
  _category: String,
});

itemSchema.index({ title : 3, description : 2});

module.exports = mongoose.model('Link', itemSchema);
