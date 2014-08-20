var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var git_notification_schema = new Schema({
	event_name : String,
	object : Object
});

module.exports = mongoose.model('GitNotifcation', git_notification_schema);