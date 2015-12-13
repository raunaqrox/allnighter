var Comment = require('../models/Comment.js');
var mongoose = require('mongoose');

exports.postComment = function(req, res){
	var userId = req.user.id;
	var name = req.user.fullName;
	var postData = req.body;
	var newComment = new Comment(req.body);
	newComment._creator = userId;
	newComment._creatorName = name;
	newComment.save(function(err, result){
		if(err) res.send("e");
		else{
			if(postData.isReply){
				Comment.update({_id: postData.topic},{$push: {replies: result.id}}, function(err){
					if(err) return console.error(err);
					res.send('s');
				});
			}else{
				res.send('s');
			}
			
		}
	});
}