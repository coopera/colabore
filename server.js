// BASE SETUP
// ==============================================

var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();
var port = process.env.PORT || 8000;
var request = require('request');

mongoose.connect('mongodb://piu:piu@mongo.onmodulus.net:27017/ryte2jaG');

app.use(bodyParser());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://gcm-layout.herokuapp.com');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

var GitNotifcation = mongoose.model('GitNotifcation', {
	object : Object
});

// ROUTES
// ==============================================

app.post('/api', function(req, res) {
	console.log("Post Message Received");
	res.send({text: "Post Message Received"});	
});

app.get('/api/gitnotifications', function(req, res) {
	GitNotifcation.find(function(err, notifications) {
		if (err)
			res.send(err)

		res.json(notifications); 
	});
});

app.get('/', function(req, res) {
	res.sendfile('./public/index.html');
});

app.post('/webhooks/github', function(req, res) {
	console.log(req.body)

	request({
	  uri: "https://colabore.slack.com/services/hooks/incoming-webhook?token=UFqe6mu7euTJPHHMGXJe7r3F",
	  method: "POST",
	  json: {
	    text: "Se essa mensagem chegar, eh pq o webhook com o github funcionou!"
	  }
	}, function(error, response, body) {
	  console.log(body);
	  res.send(body);
	});

	// create a todo, information comes from AJAX request from Angular
	GitNotifcation.create({
		object : req.body
	}, function(err, notification) {
		if (err)
			res.send(err);
	});
});

// START THE SERVER
// ==============================================
app.listen(port);
console.log('Magic happens on port ' + port);

module.exports = app;