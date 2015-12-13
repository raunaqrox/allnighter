var Type = require('../models/Type');

exports.addType = function(req, res){
	var type = req.query.type;	
	Type.findOne({'title': new RegExp('^'+ type + '$', "i")}).exec(function(err, resType){
		if(err) return console.error(err);
		if(resType){			
			res.send(resType);
		}else{
			var newType = new Type();
			newType.title = req.query.type;
			newType.addedOn = new Date();
			newType.save(function(err, result){
				if(err){
					console.error(err);
					res.send('e');
					return;
				}
				if(result){
					res.send(result);
				}else{
					res.send('e');
				}				
			});			
		}
	});
}