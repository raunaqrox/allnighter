var Category = require('../models/Category.js');
var Item = require('../models/Item.js');

/**
 * GET /
 * Home page.
 */

exports.index = function(req, res) {
	Category.find({}).sort({'addedOn': -1}).exec(function(err, cats){
		if(err){
			return console.error(err);
		}else{
			Item.find({}).sort({'addedOn': -1}).exec(function(err, items){
				req.session.items = null;
				if(err)return console.error(err);
				res.render('home', {
					title: 'Home',
					categories: cats,
					items: items,
				});
			});			
		}
	});
};