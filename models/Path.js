var mongoose = require('mongoose'),
 	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var slug = require('slug');

var pathSchema = new Schema({
  title: { type: String, unique: true, required: true},
  description: String,
  path:{ type: String, required: true},
  _creator: { type: ObjectId, required: true},
  _creatorName : {type: String, required: true},
  _categoryId: ObjectId,
  _category: String,
  tags: [ String ],
  url: String,
  addedOn: { type: Date, default: Date.Now}
});

pathSchema.index({ title : 3, description : 2, tags:2});

pathSchema.pre('save', function(next){
  this.slug = slug(this.title);
  this.url = this.id + '/' + this.slug;
  next();
});

module.exports = mongoose.model('Path', pathSchema);
