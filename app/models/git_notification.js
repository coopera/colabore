var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var git_notification_schema = new Schema({
	repo : String,
	event_name : String,
	event_time: Date,
	object : Object
});

module.exports = mongoose.model('GitNotifcation', git_notification_schema);