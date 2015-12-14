var Category = require('../models/Category.js');
var Link = require('../models/Item.js');
var Path =  require('../models/Path.js');

/**
 * GET /
 * Home page.
 */

exports.index = function(req, res) {
	Category.find({}).sort({'addedOn': -1}).exec(function(err, cats){
		if(err){
			return console.error(err);
		}else{
			Link.find({}).sort({'addedOn': -1}).exec(function(err, links){
				req.session.items = null;
				if(err)return console.error(err);
				res.render('home', {
					title: 'Home',
					categories: cats,
					items: links,
				});
			});			
		}
	});
};