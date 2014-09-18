var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var slack_notification_schema = new Schema({
	team_id			: String,
	user_id			: String,
	event_action 	: String,
	event_recipient	: String,
	event_time		: Date,
	object			: Object
});

module.exports = mongoose.model('SlackNotifcation', slack_notification_schema);