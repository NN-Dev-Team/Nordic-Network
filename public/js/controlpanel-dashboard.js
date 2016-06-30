var values = [];
var host = "N/A";
var port = -1;

function getCookie(name) {
	name += "=";
	var ca = document.cookie.split(';');
	for(i=0; i<ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1);
		if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
	}
	return "";
}

$(document).ready(function() {
    $.get("../properities.txt", function(data) {
        values = data.split("\n");
		return values;
    }, 'text');
	
	host = values[0];
	port = Number(values[1]);
	
	if(host == "N/A" || port == -1) {
		console.log("ERROR: Couldn't find host/port");
	} else {
		console.log("Creating socket...");
		var socket = io('http://' + host + ":" + port);
		if(typeof socket === 'undefined') {
			console.log("Failed to create socket");
		} else {
			console.log("Successfully created socket");
		}
	}
	
	socket.emit('get-status', {"server": Number(getCookie("user_id")), "session": getCookie("session")});
	
	socket.on('server-checked', function(data){
		if(data.success){
			if(data.info == "Minecraft") {
				console.log("Successfully started Minecraft server!");
			}
		} else {
			console.log("Failed to start server.");
			console.log("Reason: ", data.reason);
			console.log("ID: ", data.id);
		}
	});
	
	socket.on('server-stopped', function(data){
		if(data.success){
			console.log("Successfully closed server.");
		} else {
			console.log("Failed to stop server.");
			console.log("Reason: ", data.reason);
			console.log("ID: ", data.id);
		}
	});
	
	socket.on('server-stats', function(data) {
		if(data.success){
			console.log("Successfully received server status.");
			$('ip').text(data.info.IP);
			$('version').text(data.info.version);
		} else {
			console.log("Failed to get status.");
			console.log("Reason: ", data.reason);
			console.log("ID: ", data.id);
		}
	});
	
	
	$('button #start-server').click(function(){
		socket.emit('start-server', { "server": Number(getCookie("user_id")), "session": getCookie("session") });
		console.log("Starting server...");
		return false;
	});
	
	$('button #stop-server').click(function(){
		socket.emit('stop-server', { "server": Number(getCookie("user_id")), "session": getCookie("session") });
		console.log("Stopping server...");
		return false;
	});
});