var toobusy = require('toobusy-js');
var user = require('./user-extras.js');
// var mcLib = require('./auto-updater.js');
var fs = require('fs');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var bcrypt = require('bcryptjs');
var randomstring = require('randomstring');
var mkdir = require('mkdirp');
var exec = require('child_process').exec;
var Rcon = require('rcon');

var values = [];
var props = [];
var valid = false;

fs.readFile('properities.txt', 'utf8', function (err, data) {
	if (err) {
		return console.log(err);
	}
	
	var port = data.trim();
	http.listen(port, function(){
		console.log('listening on *:' + port);
	});
});

app.use(function(req, res, next) {
	if (toobusy()) {
		res.send(503, "Sorry, either we're too popular or someone is DDoS:ing (Server is overloaded)");
	} else {
		next();
	}
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

// MAIN

function Reset() {
	fs.readFile('bans.txt', 'utf8', function(err, data) {
		if(data != '') {
			var items = data.split("\n");
			for(i = 0; i < items.length; i++) {
				items[i] = items[i].split(" ");
			}
			
			for(i = 0; i < items.length; i++) {
				items[i][1] = 0;
				items[i] = items[i].join(" ");
			}
			
			data = items.join("\n");
			fs.writeFile('bans.txt', data, function(err, data) {
				return;
			});
		}
	});
}

setInterval(Reset, 4096);

// Registration functions
function reg_printError(reason, id) {
	io.emit('reg-complete', {"success": false, "reason": reason, "id": id});
}

function reg_printSuccess() {
	io.emit('reg-complete', {"success": true});
}

// Login functions
function login_printError(reason, id) {
	io.emit('login-complete', {"success": false, "reason": reason, "id": id});
}

// Server creation functions
function create_printError(reason, id) {
	io.emit('creation-complete', {"success": false, "reason": reason, "id": id});
}

function create_printSuccess(id) {
	if(typeof id == 'number') {
		io.emit('creation-complete', {"success": true, "id": id});
	} else {
		io.emit('creation-complete', {"success": true});
	}
}

// Control panel functions
function start_printError(reason, id) {
	io.emit('server-checked', {"success": false, "reason": reason, "id": id});
}

function start_printSuccess(id) {
	if(typeof id == 'number') {
		io.emit('server-checked', {"success": true, "id": id});
	} else {
		io.emit('server-checked', {"success": true});
	}
}

function stop_printError(reason, id) {
	io.emit('server-stopped', {"success": false, "reason": reason, "id": id});
}

function stop_printSuccess() {
	io.emit('server-stopped', {"success": true});
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
	var IP = socket.request.connection.remoteAddress;
	
	// REGISTRATION
	socket.on('register', function(data){
		user.isBanned(IP, function(err, banned) {
			if(err) {
				return console.log(err);
			}
			
			if(banned[0]) {
				return reg_printError("Please don't overload our servers.", '0.' + __line);
			} else if(banned[1]) {
				user.addIP(IP, function(err) {
					if(err) {
						console.log(err);
					}
					
					user.incrUsage(IP, 16);
				});
			} else {
				user.incrUsage(IP, 16);
			}
			
			if(typeof data.email != 'string' || typeof data.pass != 'string') {
				return reg_printError("Invalid email and/or password.", '1.' + __line);
			} else if(((data.email).indexOf("@") != -1) && ((data.email).indexOf(".") != -1)) {
				bcrypt.genSalt(10, function(err, salt) {
					if(err) {
						return reg_printError(err, '2.' + __line);
					}
					
					// Hash password
					bcrypt.hash(data.pass, salt, function(err, hash) { 
						if(err) {
							return reg_printError(err, '3.' + __line);
						}
						
						// Search the database to check if the user already exists
						user.find(data.email, function(err, found, dat, last, usr) {
							if(err) {
								return reg_printError(err, '4.' + __line);
							}
							
							if(found) {
								return reg_printError("An account with this email has already been registered...", '5.' + __line);
							}
							
							// User doesn't exist yet, register new user
							// Add email & hash to user file
							fs.writeFile("users/" + usr + ".txt", data.email + "\n" + hash, function(err, data) {
								if(err) {
									return reg_printError(err, '6.' + __line);
								}
								
								// Make sure next user registered doesn't get the same user id
								fs.writeFile("users/user.txt", Number(usr) + 1, function(err, data) {
									if(err) {
										return reg_printError(err, '7.' + __line);
									}
									
									reg_printSuccess();
								});
							});
						});
					});
				});
			} else {
				reg_printError("This is impossible unless you hacked :/", '8.' + __line);
			}
		});
	});
	
	// LOGIN
	socket.on('login', function(data){
		user.isBanned(IP, function(err, banned) {
			if(err) {
				return console.log(err);
			}
			
			if(banned[0]) {
				return login_printError("Please don't overload our servers.", '0.' + __line);
			} else if(banned[1]) {
				user.addIP(IP, function(err) {
					if(err) {
						console.log(err);
					}
					
					user.incrUsage(IP, 8);
				});
			} else {
				user.incrUsage(IP, 8);
			}
			
			if(typeof data.email != 'string' || typeof data.pass != 'string') {
				return login_printError("Invalid email and/or password.", '1.' + __line);
			} else if(((data.email).indexOf("@") != -1) && ((data.email).indexOf(".") != -1)) {
				user.find(data.email, function(err, found, dat, usr) {
					if(err) {
						return login_printError(err, '2.' + __line);
					}
					
					if(found) {
						bcrypt.compare(data.pass, dat[1].trim(), function(err, valid) {
							if(err) {
								return login_printError(err, '3.' + __line);
							}
							
							if(valid) {
								var userSession = randomstring.generate(16);
								userSession += Math.round(((new Date()).getTime() / 60000) + 60*24);
								dat[2] = userSession;
								
								fs.writeFile("users/" + usr + ".txt", dat.join("\n"), function(err, data) {
									if(err) {
										return login_printError(err, '4.' + __line);
									}
									
									io.emit('login-complete', {"success": true, "user": usr, "session": userSession});
								});
							}
						});
					} else {
						return login_printError("Incorrect email and/or password", '5.' + __line);
					}
				});
			} else {
				login_printError("Invalid email.", '6.' + __line);
			}
		});
	});
	
	// SERVER CREATION
	socket.on('create-serv', function(data){
		user.isBanned(IP, function(err, banned) {
			if(err) {
				return console.log(err);
			}
			
			if(banned[0]) {
				return create_printError("Please don't overload our servers.", '0.' + __line);
			} else if(banned[1]) {
				user.addIP(IP, function(err) {
					if(err) {
						console.log(err);
					}
					
					user.incrUsage(IP, 16);
				});
			} else {
				user.incrUsage(IP, 16);
			}
			
			if(typeof data.session != 'string' || (data.session).length < 24) {
				return create_printError("Invalid session ID.", '1.' + __line);
			} else if(Math.round((new Date).getTime() / 60000 > (data.session).substring(16))) {
				return create_printError("Session has expired.", '2.' + __line);
			} else if(data.type < 0 || data.type > 2) {
				return create_printError("Invalid server type.", '3.' + __line);
			} else if(typeof data.id == 'number') {
				
				// User id specified, get user session
				user.get(data.id, function(err, dat) {
					if(err) {
						return create_printError(err, '4.' + __line);
					}
					
					// Check if session is valid
					if(dat[2].trim() == data.session) {
						
						// Session valid, create server
						mkdir("servers/" + data.id, function(err) {
							if(err) {
								return create_printError(err, '5.' + __line);
							}
							
							fs.writeFile("servers/" + data.id + "/.properities", "0\n" + data.type + "\n0\n0", function(err, dat) {
								if(err) {
									return create_printError(err, '6.' + __line);
								}
								
								if(data.type == 0) {
									mcLib.addJar("servers/" + data.id, function(err) {
										if(err) {
											return create_printError(err, '7' + __line);
										}
										
										create_printSuccess();
									});
								}
							});
						});
					} else {
						create_printError("Unknown session.", '8.' + __line);
					}
				});
			} else {
				
				// User id not specified, look through every user file for a matching session
				// !! OUTDATED REMOVE IF NOT NEEDED LATER !!
				user.findSession(data.session, function(err, found, usr) {
					if(err) {
						return create_printError(err, '9.' + __line);
					}
					
					if(found) {
						// Session valid, create server
						mkdir("servers/" + usr, function(err) {
							if(err) {
								return create_printError(err, '10.' + __line);
							}
							
							fs.writeFile("servers/" + usr + "/.properities", "0\n" + data.type + "\n0\n0", function(err, dat) {
								if(err) {
									return create_printError(err, '11.' + __line);
								}
								
								if(data.type == 0) {
									mcLib.addJar("servers/" + usr, function(err) {
										if(err) {
											return create_printError(err, '12.' + __line);
										}
										
										create_printSuccess();
									});
								}
							});
						});
					} else {
						create_printError("Unknown session.", '13.' + __line);
					}
				});
			}
		});
	});
	
	// CONTROL PANEL
	socket.on('start-server', function(data){
		user.isBanned(IP, function(err, banned) {
			if(err) {
				return console.log(err);
			}
			
			if(banned[0]) {
				return start_printError("Please don't overload our servers.", '0.' + __line);
			} else if(banned[1]) {
				user.addIP(IP, function(err) {
					if(err) {
						console.log(err);
					}
					
					user.incrUsage(IP, 8);
				});
			} else {
				user.incrUsage(IP, 8);
			}
			
			if(typeof data.server != 'number' || typeof data.session != 'string') {
				return start_printError("Invalid server ID and/or session ID.", '1.' + __line);
			}
			
			fs.readFile('servers/' + data.server + '/.properities', 'utf8', function(err, dat) {
				if (err) {
					return start_printError(err, '2.' + __line);
				}
				
				props = dat.split("\n");
				var serv_isSleeping = boolify(props[0].trim());
				var serv_type = props[1].trim();
				var serv_typeCS = serv_type.substring(1, 2);
				var serv_rank = props[2].trim();
				var serv_timeOn = props[3].trim(); // Will not be used in this case, it's just here so we can remember it
				var serv_lastOn = props[4].trim(); // Will not be used in this case, it's just here so we can remember it
				var serv_ram = [[256, 512, 1024, 2048, 4096], [512, 1024, 2048, 4096], [512, 1024, 2048, 4096]];
				
				fs.readFile('users/' + data.server + ".txt", 'utf8', function(err, dat) {
					props = dat.split("\n");
					var user_session = props[2].trim();
					
					// Check if session is matching
					if(user_session == data.session) {
						
						// Run server
						if(serv_type == 0) {
							// Minecraft
							
							exec("java -Xmx" + serv_ram[serv_type][serv_rank] + "M -Xms" + serv_ram[serv_type][serv_rank] + "M -jar servers/" + data.server + "/minecraft_server.jar nogui", function(err2, out, stderr) {
								if(err2) {
									return start_printError(stderr, '3.' + __line);
								}
								
								start_printSuccess(serv_type);
							});
						} else if(serv_type.substring(0, 1) == 1) {
							// CS:GO
							
							if(serv_typeCS == 1) { // Classic Competive
								exec("./srcds_run -game csgo -console -usercon +game_type 0 +game_mode 1 +mapgroup mg_active +map de_dust2", function(err, out, stderr) {
									if(err) {
										return start_printError(stderr, '4.' + __line);
									}
									
									start_printSuccess(serv_type);
								});
							} else if(serv_typeCS == 2) { // Arms Race
								exec("./srcds_run -game csgo -console -usercon +game_type 1 +game_mode 0 +mapgroup mg_armsrace +map ar_shoots", function(err, out, stderr) {
									if(err) {
										return start_printError(stderr, '5.' + __line);
									}
									
									start_printSuccess(serv_type);
								});
							} else if(serv_typeCS == 3) { // Demolition
								exec("./srcds_run -game csgo -console -usercon +game_type 1 +game_mode 1 +mapgroup mg_demolition +map de_lake", function(err, out, stderr) {
									if(err) {
										return start_printError(stderr, '6.' + __line);
									}
									
									start_printSuccess(serv_type);
								});
							} else if(serv_typeCS == 4) { // Deathmatch
								exec("./srcds_run -game csgo -console -usercon +game_type 1 +game_mode 2 +mapgroup mg_allclassic +map de_dust", function(err, out, stderr) {
									if(err) {
										return start_printError(stderr, '7.' + __line);
									}
									
									start_printSuccess(serv_type);
								});
							} else { // Classic Casual
								exec("./srcds_run -game csgo -console -usercon +game_type 0 +game_mode 0 +mapgroup mg_active +map de_dust2", function(err, out, stderr) {
									if(err) {
										return start_printError(stderr, '8.' + __line);
									}
									
									start_printSuccess(serv_type);
								});
							}
						} else if(serv_type == 2) {
							// TF2
							return start_printError("WIP", '9.' + __line);
						} else {
							return start_printError("Unknown server type", '10.' + __line);
						}
					} else {
						return start_printError("ACCESS DENIED. But seriously, start your own server instead of others :P", '11.' + __line);
					}
				});
			});
		});
	});
	
	socket.on('stop-server', function(data) {
		user.isBanned(IP, function(err, banned) {
			if(err) {
				return console.log(err);
			}
			
			if(banned[0]) {
				return stop_printError("Please don't overload our servers.", '0.' + __line);
			} else if(banned[1]) {
				user.addIP(IP, function(err) {
					if(err) {
						console.log(err);
					}
					
					user.incrUsage(IP, 8);
				});
			} else {
				user.incrUsage(IP, 8);
			}
			
			if(typeof data.server != 'number' || typeof data.session != 'string') {
				return stop_printError("Invalid server ID and/or session ID.", '1.' + __line);
			}
			
			fs.readFile('servers/' + data.server + '/.properities', 'utf8', function(err, dat) {
				if (err) {
					return stop_printError(err, '2.' + __line);
				}
				
				props = dat.split("\n");
				var serv_isSleeping = boolify(props[0].trim());
				var serv_type = props[1].trim();
				var serv_typeCS = serv_type.substring(1, 2);
				var serv_rank = props[2].trim();
				var serv_timeOn = props[3].trim();
				var serv_IP = "";
				var rcon_port = 0;
				var rcon_pass = "";
				var serv_ram = [[256, 512, 1024, 2048, 4096], [512, 1024, 2048, 4096], [512, 1024, 2048, 4096]];
				
				fs.readFile('users/' + data.server + ".txt", 'utf8', function(err, dat) {
					props = dat.split("\n");
					var user_session = props[2].trim();
					
					// Check if session is matching
					if(user_session == data.session) {
						if(serv_type == 0) {
							// Minecraft
							
							fs.readFile('servers/' + data.server + '/server.properities', 'utf8', function(err, data) {
								if(err) {
									return stop_printError(err, '3.' + __line);
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
									stop_printSuccess();
								});
								
								conn.connect();
							});
						}
					}
				});
			});
		});
	});
	
	socket.on('console-cmd', function(data) {
		user.isBanned(IP, function(err, banned) {
			if(err) {
				return console.log(err);
			}
			
			if(banned[0]) {
				return cp_printError("Please don't overload our servers.", '0.' + __line);
			} else if(banned[1]) {
				user.addIP(IP, function(err) {
					if(err) {
						console.log(err);
					}
					
					user.incrUsage(IP, 16);
				});
			} else {
				user.incrUsage(IP, 16);
			}
			
			if(typeof data.session != 'string' || (data.session).length < 24) {
				return cp_printError("Invalid session ID.", '1.' + __line);
			} else if(Math.round((new Date).getTime() / 60000 > (data.session).substring(16))) {
				return cp_printError("Session has expired.", '2.' + __line);
			} else if(typeof data.id == 'number') {
				
				// Get user data
				user.get(data.id, function(err, dat) {
					if(err) {
						return cp_printError(err, '3.' + __line);
					}
					
					// Check if session is valid
					if(dat[2].trim() == data.session) {
						
						// Session valid, get server data
						fs.readFile('servers/' + data.server + '/.properities', 'utf8', function(err, dat) {
							if (err) {
								return cp_printError(err, '4.' + __line);
							}
							
							props = data.split("\n");
							var serv_type = props[1].trim();
							var serv_IP = "";
							var rcon_port = 0;
							var rcon_pass = "";
							
							if(serv_type == 0) {
								
								// Minecraft
								fs.readFile('servers/' + data.id + '/server.properities', 'utf8', function(err, dat) {
									if(err) {
										return cp_printError(err, '5.' + __line);
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
									}).on('error', function(err) {
										return cp_printError(err, '6.' + __line);
									});
									
									conn.connect();
								});
							} else {
								return cp_printError("This game does not support RCON :(", '7.' + __line);
							}
						});
					}
			} else {
				return cp_printError("Invalid user id.", '8.' + __line);
			}
		});
	});
});