var nodemailer = require('nodemailer');
var secrets = require('../config/secrets');
var mg = require('nodemailer-mailgun-transport');

exports.takeOrder = function(req, res){
	var data = req.body;
	req.session.items = data.items;
	res.sendStatus(200);
}

exports.getOrder = function(req, res){
	res.render('order', {
		items: req.session.items
	});
}

exports.sendOrder = function(req, res){
	var auth = {
	  auth: {
	    api_key: secrets.mailgun.key,
	    domain: 'allnighter.in'
	  }
	}
	/*
	var transporter = nodemailer.createTransport({
	    service: 'Gmail',
	    host: 'smtp.gmail.com',
	    port: 465,
	    auth: {
	        user: secrets.gmail.user,
	        pass: secrets.gmail.pass
	    }
	});*/
	
	var nodemailerMailgun = nodemailer.createTransport(mg(auth));
	var mailOptions = {
		from: 'Sahebjot Singh✔ <allnighterrestaurant1@gmail.com>',
		to: 'allnighterrestaurant1@gmail.com',
		subject: 'Order ✔',
		text: 'This is the order!',
		html: '<h3>'+req.body.phone+'</h3><h3>'+req.body.address+'</h3><br><h3>'+JSON.stringify(req.session.items)+'</h3>' // html body
	}
	nodemailerMailgun.sendMail(mailOptions, function(error, info){
		if(error){
			return console.log(error);
		}
		res.sendStatus(200);
	});
}

exports.sent = function(req, res){
	res.render('sent');
}