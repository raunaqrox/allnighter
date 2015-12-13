var Link = require('../models/Link');
var Category = require('../models/Category');
var Path = require('../models/Path');

exports.myStats = function(req, res){
	Link.aggregate([{
		$match:{
			_creator: req.user._id
		}},
		{$group:{_id:"$_id",ratingSum:{$sum:"$ratingSum"},ratingCount:{$sum:"$ratingCount"}}}
	], function(err, result){
		if(err) return console.error(err);
		res.render('stats', {
			title:'myStats',
			stats:result
		})
	});
}