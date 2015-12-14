var Link = require('../models/Item.js');
var Category = require('../models/Category.js');
var Type = require('../models/Type.js');
var Rating = require('../models/Rating.js');

exports.getAddLink = function(req, res, next){
	Type.find({}).limit(5).sort({'addedOn':1}).exec(function(err, types){
		if(err) return console.error(err);
		if(types){
			res.render('addLink', {
				'title' : 'AddLink',
				types:types
			});
		}else{
			req.flash('errors', { msg: 'Types not found!' });			
			res.render('addLink', {
				'title' : 'AddLink'
			});
		}
	});	
};

exports.postLink = function(req, res, next){
	Category.findOne({'title': {$regex: new RegExp('^'+ req.body.category + '$', "i")}}, function(err, cat){
		if(err) return console.error(err);
		if(cat){
			var newLink = new Link(req.body);
			newLink._categoryId = cat._id;
			newLink._category = cat.title;			
			newLink.save(function(err, result){
				if(err){
					if(err.code !== 11000){
						 return console.error(err);
					}else{
						req.flash('errors', { msg: newLink.title + 'has already been added to skile!' });
						res.redirect('/add-link');
						return;
					}
				}else{
					req.flash('success', { msg: 'Link has been successfully added to '+cat.title+' !' });
					res.render('addLink', {
						'title' : 'AddLink'
					});
				}
			});
		}
	});
}