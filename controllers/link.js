var Link = require('../models/Link');

exports.getLinks = function(req, res){
	var perPage = 10;
	var page = Math.max(parseInt(req.query.page), 1) || 1;
	var from = (page - 1) * perPage;
	Link.find({}).skip(from).limit(perPage).populate('_rating').sort({'addedOn' : -1}).exec(function(err, links){
		if(err) return console.error(err);
		
		if(!links){
			req.flash('errors', { msg: 'Links not found!' });
			res.render('links',{
				title:'Links'
			});
		}else{
			if(req.user){
				for(var i = 0 ;i < links.length; i++){
					if(req.user.id in links[i]._rating.userWhoVoted){
						links[i].canVote = false;
					}else{
						links[i].canVote = true;
					}
					//saving bandwidth
					links[i]._rating = null;
				}
			}else{
				for(var i = 0 ;i < links.length; i++){
					links[i].canVote = false;
				}
			}
			Link.count().exec(function(err, count){
				if(err) return console.error(err);
				res.render('links',
				{
					title:'Links',
					links: links,
					count: count,
					page: page,
					pages: Math.ceil(count/perPage)
				});	
			});
		}
	});
}

exports.searchLinks = function(req, res){
	var query = req.body.linkTitle;	
	Link.find({$text:{$search:query}}).limit(10).exec(function(err, links){
		if(err) return console.error(err);
		if(!links){
			req.flash('errors', { msg: 'Links not found!' });
			res.render('links',{
				title:'Links'
			});
		}else{
			res.render('links',
				{
					title:'Links',
					links:links
				});	
		}
	});
}

exports.myLinks = function(req, res){
	var perPage = 10;
	var page = Math.max(parseInt(req.query.page), 1) || 1;
	var from = (page - 1) * perPage;
	Link.find({_creator: req.user.id}).skip(from).limit(perPage).sort({'addedOn' : -1}).exec(function(err, links){
		if(err) return console.error(err);
		
		if(!links){
			req.flash('errors', { msg: 'No links added!' });
			res.render('links',{
				title:'myLinks'
			});
		}
		for(var i = 0 ;i < links.length; i++){
			links[i].canVote = false;
		}
		Link.count().exec(function(err, count){
			if(err) return console.error(err);
			console.log("sending links");
			res.render('links',
			{
				title:'myLinks',
				links: links,
				count: count,
				page: page,
				pages: Math.ceil(count/perPage)
			});	
		});
	});
}

exports.updateLink = function(req, res){
	var linkData = req.body;
	Link.update({_id:linkData.id}, {$set:{title: linkData.title, url: linkData.url}}, function(err, result){
		if(err) return res.send('e');
		// check if nModified is > 0 else error
		res.send(result);
	});
}
