var github_helper = function(req){
	var time_now = new Date();
	var event_name = req.headers['x-github-event'];
	var repo = req.body.repository.full_name;
	var actor = (req.body.sender.login);

	return {
		repo		: repo,
		actor		: actor,
		event_name	: event_name,
		event_time	: time_now,
		object		: req.body
	};
};

module.exports = github_helper;