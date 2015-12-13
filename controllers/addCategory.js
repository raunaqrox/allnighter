var Category = require('../models/Category.js');
exports.getAddCategory = function(req, res, next){
	res.render('addCategory', {
		'title' : 'AddCategory'
	});
};

exports.postCategory = function(req, res, next){
	var newCategory = new Category(req.body);
	if(!req.body.parentCatTitle){
		req.body.parentCatTitle = 'None';
	}
	Category.findOne({'title': new RegExp('^'+ req.body.parentCatTitle + '$', "i")}, function(err, parentCat){
		if(err) return console.error(err);
		if(parentCat){
			newCategory._parentId = parentCat._id;
			newCategory._parentCatTitle = parentCat.title;
			newCategory._creator = req.user._id;
			newCategory._creatorName = req.user.fullName;
			newCategory.addedOn = new Date();
			newCategory.save(function(err, result){
				if(err) return console.error(err);
				req.flash('success', { msg: 'Category has been successfully added!' });
				res.render('addCategory', {
					'title' : 'AddCategory'
				});
			});
		}else{
			req.flash('errors', { msg: 'Parent Category '+req.body.parentCatTitle+' not found!' });
			res.render('addCategory', {
					'title' : 'AddCategory'
			});
		}
	});
};