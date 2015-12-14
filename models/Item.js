var mongoose = require('mongoose'),
 	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var itemSchema = new Schema({
  title: String,
  description: String,
  available: Boolean,
  _categoryId: ObjectId,
  _category: String,
  imageUrl: String,
  price: String
});

itemSchema.index({ title : 3, description : 2});

module.exports = mongoose.model('Item', itemSchema);
