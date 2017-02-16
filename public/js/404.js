var values = [];
var host = "N/A";
var port = -1;

$(document).ready(function(){
	$.get("../properties.txt", function(data) {
        values = data.split("\n");
		
		host = values[0].trim();
		port = Number(values[1]);
	}).fail(function() {
		console.log("ERROR: Failed to get server IP");
		show404();
	}).done(function() {
		var socket = io('http://' + host + ":" + port);
		if(socket.disconnected) {
			console.log("ERROR: Unable to connect to server.");
			show404();
		} else {
			var serv_type;
			var usr_id = "";
			var url = window.location.href;
			var c = 8; // So that it ignores 'http://' and 'https://'
			
			while(url[c] != "/") {
				c++;
			}
			c++;
			
			if(url.substring(c, c + 2) == "u/" && !isNaN(url[c + 2])) {
				c += 2;
				while(url[c] != "/" && !isNaN(url[c])) {
					usr_id += url[c];
					c++;
				}
				
				if(url[c] != "/") {
					show404();
				} else {
					c++;
					if(url.substring(c, c + 6) == "server") {
						socket.emit('get-user-page', {"type": 0, "id": Number(usr_id)});
					} else { // Type 1 has not been decided what it is yet so no code for it yet
						show404();
					}
				}
			} else {
				show404();
			}
			
			socket.on('show-404', show404);
		}
	});
});

function show404() {
	$('body').append('<h1 id="title">404</h1>');
}