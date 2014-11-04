var request = require('request');
var GitNotifcation = require('./../models/git_notification');
var SlackNotifcation = require('./../models/slack_notification');
var slack_helper = require('./../services/slack_helper');
var github_helper = require('./../services/github_helper');

module.exports = function(app) {

	app.get('/', function(req, res) {
		res.sendfile('./public/index.html');
	});

	app.get('/api/repos/:user/:repo', function(req, res) {
		var repo_name = req.params.user+'/'+req.params.repo;
		GitNotifcation.find({'repo': repo_name}, function(err, notifications) {
			if (err)
				res.send(err)

			res.json(notifications); 
		});
	});

	app.get('/api/repos/:user/:repo/:event_name', function(req, res) {
		var repo_name = req.params.user+'/'+req.params.repo;
		var event_name = req.params.event_name;

		GitNotifcation.find({'repo': repo_name, 'event_name': event_name}, function(err, notifications) {
			if (err)
				res.send(err)

			res.json(notifications); 
		});
	});

	app.get('/api/teams/:team_id', function(req, res) {
		var team_id = req.params.team_id;
		SlackNotifcation.find({'team_id': team_id}, function(err, notifications) {
			if (err)
				res.send(err)

			res.json(notifications); 
		});
	});

	app.post('/api/git-hook', function(req, res){
		var token = req.body.token;
		var path = req.body.path;
		var token_param = "token "+token;
		var uri_param = "https://api.github.com/repos/"+path+"/hooks";
		console.log(uri_param);
		
		request({
			uri: uri_param,
			headers: {
				Authorization: token_param,
				'User-Agent': "luizrogeriocn"
			},
			method: "POST",
			json: {
				name: "web",
				active: true,
				events: ["*"],
				config: {
					url: "http://colabore.herokuapp.com/webhooks/github",
					content_type: "json"
				}
			}
		}, function(error, response, body) {
		  console.log(body);
		  res.send(body);
		});
	});

	app.post('/webhooks/github', function(req, res) {
		var github = github_helper(req);

		GitNotifcation.create(github, function(err, notification) {
			if (err)
				res.send(err);
		});

		//notificar slack
		request({
		  uri: "https://colabore.slack.com/services/hooks/incoming-webhook?token=UFqe6mu7euTJPHHMGXJe7r3F",
		  method: "POST",
		  json: {
		    text: 'Tipo de evento: '+github.event_name
		  }
		}, function(error, response, body) {
		  console.log(body);
		  res.send(body);
		});
	});

	app.post('/webhooks/slack', function(req, res) {
		var slack = slack_helper(req);
		//salvar evento e enviar feedback ao slack
		if(slack.event_action){
			SlackNotifcation.create(slack, function(err, notification) {
				if (err)
					res.send(err);
			});

			res.send({text: "Comando: "+slack.event_action+"\nPara: <"+slack.event_recipient+">"});
		}
		else
			res.send({text: "Mensagem inválida."});
	});

	app.get('/api/gitnotifications', function(req, res) {
		GitNotifcation.find(function(err, notifications) {
			if (err)
				res.send(err)

			res.json(notifications); 
		});
	});

	app.get('/api/slacknotifications', function(req, res) {
		SlackNotifcation.find({function(err, notifications) {
			if (err)
				res.send(err)

			res.json(notifications); 
		}, {__v: 0});
	});
}