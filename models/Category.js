var mongoose = require('mongoose'),
 	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var slug = require('slug');

var categorySchema = new Schema({
  title: { type: String, unique: true},
  description: String,
  _parentId: ObjectId,
  _creator: { type: ObjectId, required: true},
  _creatorName : { type: String, required: true},
  _parentCatTitle: String,
  url: String,
  addedOn: { type: Date, default: Date.Now }
});

categorySchema.index({ title : 2, description : 1});


categorySchema.pre('save', function(next){
  this.url = slug(this.title);
  next();
});

module.exports = mongoose.model('Category', categorySchema);
