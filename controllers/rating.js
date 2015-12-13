var Link = require('../models/Link');
var Rating = require('../models/Rating');

exports.postRating = function(req, res){
	var id = req.body.id;
	var value = req.body.ratingVal;
	// console.log("incoming data for user  : ",req.user.id, req.body);
	Rating.find({topic : id,'userWhoVoted':req.user.id}, function(err, result){
		// console.log("if already voted or not ",err, result);
		if(err) return console.error(err);
		// first time voting
		if(!result.length){
			Rating.update({topic: id}, {$push: {userWhoVoted: req.user.id}}, function(err, result){
				console.log("update result ",err, result);
				if(err){
					res.send("e");
				}else{
					Link.update({_id:id},{$inc: {ratingSum: value, ratingCount: 1},}, function(err, result){
						if(err){
							res.send("e");
						}else{
							res.send(result);
						}
					});
				}
			});
		}else{
			res.send("already_v");
		}
	});
}	