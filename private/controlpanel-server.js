var path = require('path');
var mods = require('./getProps.js');
var express = mods.express;
var app = mods.app;
var http = mods.http;
var io = mods.io;
var fs = require('fs');
var exec = require('child_process').exec;

var values = mods.values;
var props = mods.props;

function printError(reason, id) {
	io.emit('server-checked', {"success": false, "reason": reason, "id": id});
}

function printSuccess(type) {
	io.emit('server-checked', {"success": true, "type": type});
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
			return printError("Invalid server ID and/or session ID.", 0);
		}
		
		fs.readFile('servers/' + (data.server).toString() + '/.properities', 'utf8', function(err, dat) {
			if (err) {
				return printError(err, 1);
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
					
					exec("java -Xmx" + serv_ram[serv_type][serv_rank] + "M -Xms" + serv_ram[serv_type][serv_rank] + "M -jar servers/" + data.server + "/minecraft_server.jar nogui", function(err2, out, stderr) {
						if(err2) {
							return printError(stderr, 2);
						}
						
						printSuccess(serv_type);
					});
				} else if(serv_type.substring(0, 1) == 1) {
					// CS:GO
					
					if(serv_typeCS == 1) { // Classic Competive
						exec("./srcds_run -game csgo -console -usercon +game_type 0 +game_mode 1 +mapgroup mg_active +map de_dust2", function(err, out, stderr) {
							if(err) {
								return printError(stderr, 3.0);
							}
							
							printSuccess(serv_type);
						});
					} else if(serv_typeCS == 2) { // Arms Race
						exec("./srcds_run -game csgo -console -usercon +game_type 1 +game_mode 0 +mapgroup mg_armsrace +map ar_shoots", function(err, out, stderr) {
							if(err) {
								return printError(stderr, 3.1);
							}
							
							printSuccess(serv_type);
						});
					} else if(serv_typeCS == 3) { // Demolition
						exec("./srcds_run -game csgo -console -usercon +game_type 1 +game_mode 1 +mapgroup mg_demolition +map de_lake", function(err, out, stderr) {
							if(err) {
								return printError(stderr, 3.2);
							}
							
							printSuccess(serv_type);
						});
					} else if(serv_typeCS == 4) { // Deathmatch
						exec("./srcds_run -game csgo -console -usercon +game_type 1 +game_mode 2 +mapgroup mg_allclassic +map de_dust", function(err, out, stderr) {
							if(err) {
								return printError(stderr, 3.3);
							}
							
							printSuccess(serv_type);
						});
					} else { // Classic Casual
						exec("./srcds_run -game csgo -console -usercon +game_type 0 +game_mode 0 +mapgroup mg_active +map de_dust2", function(err, out, stderr) {
							if(err) {
								return printError(stderr, 3.4);
							}
							
							printSuccess(serv_type);
						});
					}
				} else if(serv_type == 2) {
					// TF2
					
				} else {
					return printError("Unknown server type", 4);
				}
			} else {
				return printError("ACCESS DENIED. But seriously, start your own server instead of others :P", 5);
			}
		});
	});
});
