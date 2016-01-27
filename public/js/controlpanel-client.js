var values = [];
var host = "N/A";
var port = -1;

$(document).ready(function() {
    $.get("http://nordic-network.tk/properities.txt", function(data) {
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
				console.log("Running Minecraft server.");
			}
		} else if(!data.success) {
			console.log("Failed to start Minecraft server.");
			console.log("Reason: " + data.reason);
		}
	});
}

function startServer(serverID, sessionID){
	socket.emit('start-server', { "server": serverID, "session": sessionID });
	console.log("Starting server...");
}