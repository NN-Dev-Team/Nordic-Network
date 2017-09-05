var values = [];
var host = "N/A";
var port = -1;

$(document).ready(function(){
	$.get("properties.txt", function(data) {
        values = data.split("\n");
		
		host = values[0].trim();
		port = Number(values[1]);
	}).fail(function() {
		console.log("ERROR: Failed to get server IP");
		show404();
	}).done(function() {
		if(port) {
			var socket = io('http://' + host + ":" + port);
		} else {
			var socket = io('http://' + host);
		}
		
		var disconnected = false;
		
		socket.on('connect_error', function() {
			if(!disconnected) {
				disconnected = true;
				swal("Unable to connect to server.", "It seems our game servers are down.\nPlease be patient while we work on a fix!", "error");
			}
		});
		
		socket.on('disconnect', function() {
			disconnected = true;
			swal("Disconnected from server", "Hmm, looks like something went wrong. Please report this to our development team at https://github.com/NN-Dev-Team/Nordic-Network/issues", "error");
		});
		
		if(!disconnected) {
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