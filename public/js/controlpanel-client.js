var values = [];
var host = "N/A";
var port = -1;

$(document).ready(function() {
    $.get("../properities.txt", function(data) {
        values = data.split("\n");
		return values;
    }, 'text');
	return values;
});

function getCookie(name) {
    name += "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}

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
	
	socket.on('server-checked', function(data){
		if(data.success){
			if(data.type == "Minecraft") {
				console.log("Successfully started Minecraft server!");
			}
		} else {
			console.log("Failed to start server.");
			console.log("Reason: ", data.reason);
			console.log("ID: ", data.id);
		}
	});
}

$('button #start-server').click(function(){
	socket.emit('start-server', { "server": getCookie("id"), "session": getCookie("session") });
	console.log("Starting server...");
	return false;
});

function startServer(serverID){
	socket.emit('start-server', { "server": serverID, "session": getCookie("session") });
	console.log("Starting server...");
}