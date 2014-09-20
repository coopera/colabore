var interpreter = function(msg){

	var recipient_regex = /<(.*?)>/g;
	var cmd_regex = /:([^:]*):/g;

	var recipient_results = [];
	var m;

	do{
		m = recipient_regex.exec(msg);
		if(m){
			recipient_results.push(m[1]);
		}
	} while(m);

	var recipient = undefined;
	for(var i = 0; i < recipient_results.length; i++){
		if(/[@|!](.*)/.exec(recipient_results[i]) != undefined){
			var p_recipient = /(\W).*/g.exec(recipient_results[i])[1];
			recipient = /[@|!](.*)/g.exec(recipient_results[i])[1];
			recipient = p_recipient + recipient;
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

	if((recipient == undefined)||(cmd == undefined))
		return false;

	return {command: cmd, recipient: recipient};
};

module.exports = interpreter;