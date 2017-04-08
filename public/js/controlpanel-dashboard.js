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
    $.get("../properties.txt", function(data) {
        values = data.split("\n");
		
		host = values[0].trim();
		port = Number(values[1]);
	}).fail(function() {
		swal("Failed to get server IP", "Please contact our admins about this error so we can fix it as soon as possible!", "error");
	}).done(function() {
		if(port) {
			var socket = io('http://' + host + ":" + port);
		} else {
			var socket = io('http://' + host);
		}
		
		socket.on('connect_error', function() {
			swal("Unable to connect to server.", "It seems our game servers are down.\nPlease be patient while we work on a fix!", "error");
		});
		
		socket.on('disconnect', function() {
			swal("Disconnected from server", "Hmm, looks like something went wrong. Please report this to our development team at https://github.com/NN-Dev-Team/Nordic-Network/issues", "error");
		});
		
		socket.emit('get-status', {"server": Number(getCookie("user_id")), "session": getCookie("session")});
		
		socket.on('server-checked', function(data){
			if(!data.success) {
				swal("Failed to start server", "Reason: " + data.error + "\nID: " + data.id, "error");
			}
		});
		
		socket.on('server-stopped', function(data){
			if(!data.success) {
				swal("Failed to stop server", "Reason: " + data.error + "\nID: " + data.id, "error");
			}
		});
		
		socket.on('server-stats', function(data) {
			if(data.success){
				$('ip').text(data.info.IP);
				$('version').text(data.info.version);
			} else {
				swal("Failed to get server status", "Reason: " + data.error + "\nID: " + data.id, "error");
			}
		});
		
		$('button #start-server').click(function(){
			socket.emit('start-server', { "server": Number(getCookie("user_id")), "session": getCookie("session") });
			return false;
		});
		
		$('button #stop-server').click(function(){
			socket.emit('stop-server', { "server": Number(getCookie("user_id")), "session": getCookie("session") });
			return false;
		});
    }, 'text');
});
