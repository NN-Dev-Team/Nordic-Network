var path = require('path');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var exec = require('child_process').exec;
var toobusy = require('toobusy');

var values = [];
var props = [];

fs.readFile('../public/properities.txt', 'utf8', function (err, data) {
	if (err) {
		return console.log(err);
	}
	values = data.split("\n");
	var port = values[1];
	http.listen(port, function(){
		console.log('listening on *:' + port);
	});

});

app.use(function(req, res, next) {
	if (toobusy()) res.send(503, "Sorry, either we're too popular or someone is DDoS:ing (Server is overloaded)");
	else next();
});

// REMOVE THIS WHEN PUTTING THE CODE ONLINE                      |
app.get('/', function(req, res) { //                             |
    res.sendFile(path.join(__dirname + '/test-client.html')); // |
}); //                                                           v

function printError(reason, id) {
	io.emit('server-checked', {"success": false, "reason": reason, "id": id});
}

io.on('connection', function(socket){
	socket.on('start-server', function(data){
		if(typeof data.server != 'number' || typeof data.session != 'string') {
			return printError("Invalid server ID and/or session ID.", 0);
		}
		
		fs.readFile('servers/' + (data.server).toString() + '/.properities', 'utf8', function(err, dat) {
			if (err) {
				return printError(err, 1);
			}
			
			props = dat.split("\n");
			
			// Check if session is matching
			if((props[0]).trim() == (data.session).trim()) {
			
				// Run server
				exec("java -Xmx256M -Xms256M -jar minecraft_server.jar", function(err2, out, stderr) {
					if(err2) {
						return printError(stderr, 2);
					} else {
						io.emit('server-checked', {"success": true, "type": "Minecraft"});
					}
				});
			} else {
				return printError("ACCESS DENIED. But seriously, start your own server instead of others :P", 3);
			}
		});
	});
});
