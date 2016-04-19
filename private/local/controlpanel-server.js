var path = require('path');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var exec = require('child_process').exec;
var toobusy = require('toobusy-js');

var values = [];
var props = [];

fs.readFile('../../public/properities.txt', 'utf8', function (err, data) {
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

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/test-client.html'));
});

// Get line number; for debugging
Object.defineProperty(global, '__stack', {
  get: function(){
    var orig = Error.prepareStackTrace;
    Error.prepareStackTrace = function(_, stack){ return stack; };
    var err = new Error;
    Error.captureStackTrace(err, arguments.callee);
    var stack = err.stack;
    Error.prepareStackTrace = orig;
    return stack;
  }
});

Object.defineProperty(global, '__line', {
  get: function(){
    return __stack[1].getLineNumber();
  }
});

function printError(reason, id) {
	io.emit('server-checked', {"success": false, "reason": reason, "id": id});
}

function printSuccess(id) {
	if(typeof id == 'number') {
		io.emit('server-checked', {"success": true, "id": id});
	} else {
		io.emit('server-checked', {"success": true});
	}
}

function boolify(obj, ignoreCase) {
	if(ignoreCase) {
		str = str.toLowerCase();
	}
	
	if(obj == 'true' || obj == 1 || obj == '1') {
		return true;
	} else {
		return false;
	}
}

io.on('connection', function(socket){
	socket.on('start-server', function(data){
		if(typeof data.server != 'number' || typeof data.session != 'string') {
			return printError("Invalid server ID and/or session ID.", Number('0.' + __line));
		}
		
		fs.readFile('../servers/' + data.server + '/.properities', 'utf8', function(err, dat) {
			if (err) {
				return printError(err, Number('1.' + __line));
			}
			
			props = dat.split("\n");
			var serv_session = props[0].trim();
			var serv_isSleeping = boolify(props[1].trim());
			var serv_type = props[2].trim();
			var serv_typeCS = serv_type.substring(1, 2);
			var serv_rank = props[3].trim();
			var serv_timeOn = props[4].trim();
			var serv_ram = [[256, 512, 1024, 2048, 4096], [512, 1024, 2048, 4096], [512, 1024, 2048, 4096]];
			
			// Check if session is matching
			if(serv_session == data.session) {
			
				// Run server
				if(serv_type == 0) {
					// Minecraft
					
					exec("java -Xmx" + serv_ram[serv_type][serv_rank] + "M -Xms" + serv_ram[serv_type][serv_rank] + "M -jar ../servers/" + data.server + "/minecraft_server.jar nogui", function(err2, out, stderr) {
						if(err2) {
							return printError(stderr, Number('2.' + __line));
						}
						
						printSuccess(serv_type);
					});
				} else if(serv_type.substring(0, 1) == 1) {
					// CS:GO
					
					if(serv_typeCS == 1) { // Classic Competive
						exec("./srcds_run -game csgo -console -usercon +game_type 0 +game_mode 1 +mapgroup mg_active +map de_dust2", function(err, out, stderr) {
							if(err) {
								return printError(stderr, Number('3.' + __line));
							}
							
							printSuccess(serv_type);
						});
					} else if(serv_typeCS == 2) { // Arms Race
						exec("./srcds_run -game csgo -console -usercon +game_type 1 +game_mode 0 +mapgroup mg_armsrace +map ar_shoots", function(err, out, stderr) {
							if(err) {
								return printError(stderr, Number('4.' + __line));
							}
							
							printSuccess(serv_type);
						});
					} else if(serv_typeCS == 3) { // Demolition
						exec("./srcds_run -game csgo -console -usercon +game_type 1 +game_mode 1 +mapgroup mg_demolition +map de_lake", function(err, out, stderr) {
							if(err) {
								return printError(stderr, Number('5.' + __line));
							}
							
							printSuccess(serv_type);
						});
					} else if(serv_typeCS == 4) { // Deathmatch
						exec("./srcds_run -game csgo -console -usercon +game_type 1 +game_mode 2 +mapgroup mg_allclassic +map de_dust", function(err, out, stderr) {
							if(err) {
								return printError(stderr, Number('6.' + __line));
							}
							
							printSuccess(serv_type);
						});
					} else { // Classic Casual
						exec("./srcds_run -game csgo -console -usercon +game_type 0 +game_mode 0 +mapgroup mg_active +map de_dust2", function(err, out, stderr) {
							if(err) {
								return printError(stderr, Number('7.' + __line));
							}
							
							printSuccess(serv_type);
						});
					}
				} else if(serv_type == 2) {
					// TF2
					return printError("WIP", Number('8' + __line));
				} else {
					return printError("Unknown server type", Number('9.' + __line));
				}
			} else {
				return printError("ACCESS DENIED. But seriously, start your own server instead of others :P", Number('10.' + __line));
			}
		});
	});
});
