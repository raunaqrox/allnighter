var Path = require('../models/Path.js');
var Comment = require('../models/Comment.js');

exports.getPaths = function(req, res){

	Path.find({}).limit(5).exec(function(err, result){
		if(err) return console.error(err);
		if(result){
			res.render('paths',{
				title:'Paths',
				paths: result
			});
		}else{
			req.flash('errors', { msg: 'Paths not found!' });
			res.render('paths',{
				title:'Paths'
			});
		}
	});
}

exports.getPath = function(req, res){
	var pathId = req.params.id;
	Path.findOne({_id: pathId}, function(err, path){
		Comment.find({ topic: pathId}).sort({'addedOn':-1}).populate('replies').exec(function(err, comments){
			if(err) return console.error(err);
			if(path){
				res.render('path',{
					path: path,
					comments: comments
				});
			}else{
				req.flash('errors', { msg: 'Path not found!' });
				res.render('path');
			}
		
		});
	});
		
}