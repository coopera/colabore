var request = require('request');
var GitNotifcation = require('./../models/git_notification');

module.exports = function(app) {

	app.post('/api', function(req, res) {
		var msg = req.body.text;
		
		var user_regex = /<(.*?)>/g;
		var cmd_regex = /:([^:]*):/g;

		var user_results = [];
		var m;

		do{
			m = user_regex.exec(msg);
			if(m){
				user_results.push(m[1]);
			}
		} while(m);

		var user = undefined;
		for(var i = 0; i < user_results.length; i++){
			if(/[@|!](.*)/.exec(user_results[i]) != undefined){
				var p_user = /(\W).*/g.exec(user_results[i])[1];
				user = /[@|!](.*)/g.exec(user_results[i])[1];
				user = p_user + user;
				break;
			}
		}

		var cmd_results = [];
		var n;
		do{
			n = cmd_regex.exec(msg);
			if(n){
				cmd_results.push(n[1]);
			}
		} while(n);

		var cmd = cmd_results[0];
		
		if((user == undefined)||(cmd == undefined))
			res.send({text: "Mensagem inválida."});
		else
			res.send({text: "Comando: "+cmd+"\nPara: <"+user+">"});
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

	app.get('/api/repos/:user/:repo', function(req, res) {
		var repo_name = req.params.user+'/'+req.params.repo;
		GitNotifcation.find({'repo': repo_name}, function(err, notifications) {
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
		var time_now = new Date();
		var name = req.headers['x-github-event'];
		var repo = req.body.repository.full_name;

		GitNotifcation.create({
			object : req.body,
			event_time: time_now,
			event_name: name,
			repo: repo
		}, function(err, notification) {
			if (err)
				res.send(err);
		});

		//notificar slack
		request({
		  uri: "https://colabore.slack.com/services/hooks/incoming-webhook?token=UFqe6mu7euTJPHHMGXJe7r3F",
		  method: "POST",
		  json: {
		    text: 'Tipo de evento: '+name
		  }
		}, function(error, response, body) {
		  console.log(body);
		  res.send(body);
		});	
	});
}