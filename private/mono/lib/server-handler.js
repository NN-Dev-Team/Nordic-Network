var mkdir = require('mkdirp');
var path = require('path');
var user = require('./user-lib.js');
var fs = require('fs');
var exec = require('child_process').exec;
var mcLib = require('./auto-updater.js');

//////////////// 'server/.properties' file structure ////////////////
//                                                                 //
//  LINE 0: Sleep state; boolean                                   //
//  LINE 1: Type; number                                           //
//  LINE 2: Rank; number                                           //
//  LINE 3: Last time server was online; number (ms since 1970)    //
//  LINE 4: Payment period start; number (ms since 1970)           //
//  LINE 5: Unused donations; string (currency_char + number)      //
//  LINE 6: Playing time during last 2 weeks; number               //
//                                                                 //
/////////////////////////////////////////////////////////////////////

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

////////////////////////////////    SERVER CREATION    ////////////////////////////////

exports.create = function createServer(data, IP, callback) {
	if(!data || typeof data.session != 'string' || (data.session).length < 24) {
		return console.log("[!] Possible hacker detected (with IP: " + IP + ")");
	} else if(data.type < 0 || data.type > 2) {
		return callback({"error": "INVALID_SERV_TYPE", "id": 1, "line": __line});
	} else if(typeof data.id == 'number') {
		
		// User id specified, get user session
		user.get(data.id, function(err, dat) {
			if(err) {
				return callback({"error": err.error, "id": 2, "line": __line + "." + err.line});
			}
			
			var session = dat[2].trim();
			
			// Check if session is valid
			if(session == data.session && session != "SESSION EXPIRED") {
				
				// Session valid, create server
				mkdir(path.join(__dirname, "../users/", data.id.toString(), "/server"), function(err) {
					if(err) {
						return callback({"error": err, "id": 3, "line": __line});
					}
					
					fs.writeFile(path.join(__dirname, "../users/", data.id.toString(), "/server/.properties"), "0\n" + data.type + "\n0\n0", {mode: 0o600}, function(err, dat) {
						if(err) {
							return callback({"error": err, "id": 4, "line": __line});
						}
						
						if(data.type == 0) {
							mcLib.addJar(path.join(__dirname, "../users/", data.id.toString(), "/server"), function(err) {
								if(err) {
									return callback({"error": err.error, "id": 5, "line": __line + "." + err.line});
								}
								
								callback(err, data.id);
							});
						}
					});
				});
			} else {
				return callback({"error": "SESSION_EXPIRED", "id": 6, "line": __line});
			}
		});
	} else {
		return console.log("[!] Possible hacker detected (with IP: " + IP + ")");
	}
}

////////////////////////////////    STARTING SERVER    ////////////////////////////////

exports.start = function startServer(data, IP, callback) {
	if(!data || typeof data.server != 'number' || typeof data.session != 'string') {
		return console.log("[!] Possible hacker detected (with IP: " + IP + ")");
	}
	
	var server = data.server.toString();
	
	fs.readFile(path.join(__dirname, '../users/', server, '/server/.properties'), 'utf8', function(err, dat) {
		if (err) {
			return callback({"error": err, "id": 1, "line": __line});
		}
		
		props = dat.split("\n");
		var serv_isSleeping = boolify(props[0].trim());
		var serv_type = props[1].trim();
		var serv_rank = props[2].trim();
		var serv_ram = [256, 512, 1024, 2048, 4096];
		
		user.get(server, function(err, dat) {
			if(err) {
				return callback({"error": err.error, "id": 2, "line": __line + "." + err.line});
			}
			
			var user_session = dat[2].trim();
			
			if(serv_isSleeping) {
				// Stop sleeping process; stop sleep-mode jar
				// TODO
			}
			
			// Check if session is matching
			if(user_session == data.session && user_session != "SESSION EXPIRED") {
				
				// Run server
				if(serv_type[0] == 0) {
					// Minecraft PC
					
					if(serv_type == 0.1) {
						// Run resource-saving server
						// TODO
					} else {
						exec("cd " + path.join(__dirname, "../users/", server, "/server") + " && java -Xmx" + serv_ram[serv_rank] + "M -Xms" + serv_ram[serv_rank] + "M -jar ./minecraft_server.jar nogui", function(err, out, stderr) {
							if(err) {
								return callback({"error": stderr, "id": 4, "line": __line});
							}
							
							callback(err, serv_type);
						});
					}
				} else if(serv_type == 1) {
					// Minecraft PE
					// TODO
					
					callback({"error": "FEATURE_WIP_OR_DELETED", "id": 5, "line": __line});
				} else {
					// Minecraft Win 10
					// TODO
					
					callback({"error": "FEATURE_WIP_OR_DELETED", "id": 6, "line": __line});
				}
			} else {
				return callback({"error": "SESSION_EXPIRED", "id": 7, "line": __line});
			}
		});
	});
}

////////////////////////////////    STOPPING SERVER    ////////////////////////////////

exports.stop = function stopServer(data, IP, callback) {
	if(!data || typeof data.server != 'number' || typeof data.session != 'string') {
		return console.log("[!] Possible hacker detected (with IP: " + IP + ")");
	}
	
	var server = data.server.toString();
	
	fs.readFile(path.join(__dirname, '../users/', server, '/server/.properties'), 'utf8', function(err, dat) {
		if (err) {
			return callback({"error": err, "id": 1, "line": __line});
		}
		
		var props = dat.split("\n");
		var serv_isSleeping = boolify(props[0].trim());
		var serv_type = props[1].trim();
		var serv_IP = "";
		var rcon_port = 0;
		var rcon_pass = "";
		
		user.get(server, function(err, dat) {
			if(err) {
				return callback({"error": err.error, "id": 2, "line": __line + "." + err.line});
			}
			
			var user_session = dat[2].trim();
			
			// Check if session is matching
			if(user_session == data.session && user_session != "SESSION EXPIRED") {
				if(serv_isSleeping) {
					// Stop sleeping process; stop sleep-mode jar
					// TODO
					
					return callback();
				} else if(serv_type == 0) {
					// Minecraft PC
					
					if(serv_type == 0.1) {
						// Stop resource-saving server; has different configuration files and the server itself can't be stopped in the same way
						// TODO
					} else {
						fs.readFile(path.join(__dirname, '../users/', server, '/server/server.properties'), 'utf8', function(err, data) {
							if(err) {
								return callback({"error": err, "id": 3, "line": __line});
							}
							
							props = data.split("\n");
							for(i = 0; i < props.length; i++) {
								if(props[i].substring(0, 9) == 'server-ip') {
									serv_IP = props[i].substring(10);
								} else if(props[i].substring(0, 9) == 'rcon.port') {
									rcon_port = props[i].substring(10);
								} else if(props[i].substring(0, 13) == 'rcon.password') {
									rcon_pass = props[i].substring(14);
								}
							}
							
							var conn = new Rcon(serv_IP, rcon_port, rcon_pass);
							
							conn.on('auth', function() {
								conn.send('stop');
							}).on('error', function(err) {
								callback(); // Just sending a normal callback since the error usually seems to be that the server has stopped
							}).on('end', function() {
								callback();
							});
							
							conn.connect();
						});
					}
				} else if(serv_type == 1) {
					// Minecraft PE
					// TODO
					
					callback({"error": "FEATURE_WIP_OR_DELETED", "id": 4, "line": __line});
				} else {
					// Minecraft Win 10
					// TODO
					
					callback({"error": "FEATURE_WIP_OR_DELETED", "id": 5, "line": __line});
				}
			} else {
				return callback({"error": "SESSION_EXPIRED", "id": 6, "line": __line});
			}
		});
	});
}

////////////////////////////////    SEND COMMAND TO SERVER    ////////////////////////////////

exports.sendCMD = function sendCommand(data, IP, callback) {
	if(!data || typeof data.session != 'string' || (data.session).length < 24) {
		return console.log("[!] Possible hacker detected (with IP: " + IP + ")");
	} else if(typeof data.id == 'number') {
		
		// Get user data
		user.get(data.id, function(err, dat) {
			if(err) {
				return callback({"error": err.error, "id": 1, "line": __line + '.' + err.line});
			}
			
			// Check if session is valid
			if(dat[2].trim() == data.session && dat[2].trim() != "SESSION EXPIRED") {
				
				// Session valid, get server data
				fs.readFile(path.join(__dirname, '../users/', data.id.toString(), '/server/server.properties'), 'utf8', function(err, dat) {
					if (err) {
						return callback({"error": err, "id": 2, "line": __line});
					}
					
					props = data.split("\n");
					var serv_type = props[1].trim();
					var serv_IP = "";
					var rcon_port = 0;
					var rcon_pass = "";
					
					if(serv_type == 0) {
						
						// Minecraft
						fs.readFile(path.join(__dirname, '../users/', data.id.toString(), '/server/server.properties'), 'utf8', function(err, dat) {
							if(err) {
								return callback({"error": err, "id": 3, "line": __line});
							}
							
							props = dat.split("\n");
							for(i = 0; i < props.length; i++) {
								if(props[i].substring(0, 9) == 'server-ip') {
									serv_IP = props[i].substring(10);
								} else if(props[i].substring(0, 9) == 'rcon.port') {
									rcon_port = props[i].substring(10);
								} else if(props[i].substring(0, 13) == 'rcon.password') {
									rcon_pass = props[i].substring(14);
								}
							}
							
							var conn = new Rcon(serv_IP, rcon_port, rcon_pass);
							
							conn.on('auth', function() {
								conn.send(data.cmd);
							}).on('response', function(data) {
								callback(err, data);
							}).on('error', function(err) {
								return callback({"error": err, "id": 4, "line": __line});
							});
							
							conn.connect();
						});
					} else {
						return callback({"error": "NO_RCON_SUPPORT", "id": 5, "line": __line});
					}
				});
			} else {
				return callback({"error": "SESSION_EXPIRED", "id": 6, "line": __line});
			}
		});
	} else {
		return console.log("[!] Possible hacker detected (with IP: " + IP + ")");
	}
}