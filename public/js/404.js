var values = [];
var host = "N/A";
var port = -1;

$(document).ready(function(){
	$.get("../properities.txt", function(data) {
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
			socket.emit('get-user-page', {"url": window.location.href});
			
			socket.on('show-404', show404);
		}
	});
});

function show404() {
	$('body').append('<h1 id="title">404</h1>');
}