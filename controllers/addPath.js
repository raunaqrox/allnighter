var Path = require('../models/Path.js');
var Category = require('../models/Category.js');
var Link = require('../models/Link.js');

exports.getAddPath = function(req, res){
	res.render('addPath',{
		title:'AddPath'
	});
}

exports.postAddPath = function(req, res){
	var myPath = new Path(req.body);
	// verify if each link exists can be done in client side with typeahead
	Category.findOne({'title': new RegExp('^'+ req.body.category + '$', "i")}, function(err, category){
		if(err) return console.error(err);
		if(category){
			myPath._categoryId = category._id;
			myPath._category = category.title;
			myPath.addedOn = new Date();
			myPath._creator = req.user._id;
			myPath._creatorName = req.user.fullName;
			myPath.save(function(err, result){
				if(err) return console.error(err);
				req.flash('success', { msg: 'Path has been successfully added!' });
				res.render('addPath', {
					'title' : 'AddPath'
				});
			});
		}else{
			req.flash('errors', { msg: 'Category '+req.body.category+' not found!' });
			res.render('addLink', {
					'title' : 'AddLink'
			});
		}
	});
}