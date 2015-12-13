var Category = require('../models/Category.js');
exports.getAddCategory = function(req, res, next){
	res.render('addCategory', {
		'title' : 'AddCategory'
	});
};

exports.postCategory = function(req, res, next){
	var newCategory = new Category(req.body);
	Category.findOne({'title': new RegExp('^'+ req.body.parentCatTitle + '$', "i")}, function(err, parentCat){
		if(err) return console.error(err);
		newCategory.save(function(err, result){
			if(err) return console.error(err);
			req.flash('success', { msg: 'Category has been successfully added!' });
			res.render('addCategory', {
				'title' : 'AddCategory'
			});
		});
	});
};