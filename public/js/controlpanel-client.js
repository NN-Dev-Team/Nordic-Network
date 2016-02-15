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
	
	socket.on('client-id', function(data){
		console.log("ID:", data);
	});
}

$('button #start-server').click(function(){
	socket.emit('start-server', { "server": serverID, "session": sessionID });
	console.log("Starting server...");
	return false;
});

function startServer(serverID, sessionID){
	socket.emit('start-server', { "server": serverID, "session": sessionID });
	console.log("Starting server...");
}