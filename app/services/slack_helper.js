var interpreter = require('./command_interpreter');

var slack_helper = function(req){
	var msg = interpreter(req.body.text);
	var cmd = msg.command;
	var recipient = msg.recipient;

	var team_id = req.body.team_id;
	var user_id = req.body.user_id;
	var time_now = new Date();

	return {
		team_id				: team_id,
		user_id				: user_id,
		event_action 		: cmd,
		event_recipient		: recipient,
		object				: req.body,
		event_time			: time_now
	};
};

module.exports = slack_helper;