var nodemailer = require('nodemailer');
var secrets = require('../config/secrets');

exports.takeOrder = function(req, res){
	var data = req.body;
	req.session.items = data.items;
}

exports.getOrder = function(req, res){
	res.render('order', {
		items: req.session.items
	});
}

exports.sendOrder = function(req, res){
	var transporter = nodemailer.createTransport({
	    service: 'Gmail',
	    host: 'smtp.gmail.com',
	    port: 465,
	    auth: {
	        user: secrets.gmail.user,
	        pass: secrets.gmail.pass
	    }
	});
	var mailOptions = {
		from: 'Sahebjot Singh✔ <sahebjot94@gmail.com>',
		to: 'sahebjot94@gmail.com',
		subject: 'Order ✔',
		text: 'This is the order!',
		html: '<h3>'+req.body.phone+'</h3><h3>'+req.body.address+'</h3><br><h3>'+JSON.stringify(req.session.items)+'</h3>' // html body
	}
	transporter.sendMail(mailOptions, function(error, info){
		if(error){
			return console.log(error);
		}
		res.sendStatus(200);
	});
}

exports.sent = function(req, res){
	res.render('sent');
}