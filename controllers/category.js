var Category = require('../models/Category.js');
var Link = require('../models/Link');

exports.getCategory = function(req, res){
	var slug = req.params.slug;
	Category.findOne({url : slug}, function(err, cat){
		if(!cat){
			req.flash('errors', { msg: 'Category not found!' });
			res.redirect('/');
		}else{
			Link.find({_categoryId:cat._id}).limit(10).exec(function(err, links){
				if(err) return console.error(err);
				if(links){
					res.render('category', {
						title:cat.title,
						cat:cat,
						links: links,
					});
				}else{
					req.flash('errors', { msg: 'No links found!' });
					res.redirect('/');
				}
			});			
		}		
	});	
}

exports.getCategories = function(req, res){
	Category.find({_parentCatTitle:'None'}).exec(function(err, cats){
		if(err) return console.error(err);
		if(cats.length){
			res.render('categories',{
				title:'Categories',
				categories:cats
			});
		}else{
			req.flash('errors', { msg: 'No categories found!' });
			res.render('categories');
		}
	});	
}

exports.getCatChild = function(req, res){
	var slug = req.params.slug;
	Category.findOne({url : slug}, function(err, cat){
		if(err) return console.error(err);
		if(!cat){
			req.flash('errors', { msg: 'Category not found!' });
			res.redirect('/');
		}else{
			Category.find({_parentId : cat._id}, function(err, childCats){
				if(err) return console.error(err);
				if(childCats.length){
					res.render('category',{
						childCats:childCats,
						cat:cat
					});
				}else{
					req.flash('errors', { msg: 'No child categories found!' });
					res.render('category',{
						cat:cat
					});
				}
			});
		}
	});
}

exports.searchCategory = function(req, res){
	var query = req.body.catTitle;
	Category.find({$text:{$search:query}}).limit(10).exec(function(err, cats){
		if(err) return console.error(err);
		if(!cats){
			req.flash('errors', { msg: 'Category not found!' });
			res.render('categories',{
				title:'Categories'
			});
		}else{
			res.render('categories',
				{
					title:'Categories',
					links: cats,
					categories: cats
				});	
		}
	});
}