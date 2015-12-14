exports.takeOrder = function(req, res){
	var data = req.body;
	req.session.items = data.items;
	res.send(200);
}

exports.getOrder = function(req, res){
	res.render('order', {
		items: req.session.items
	});
}