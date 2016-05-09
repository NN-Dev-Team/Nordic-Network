var toobusy = require('toobusy-js');
var user = require('./user-extras.js');
var mcLib = require('./auto-updater.js');
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

var values = [];
var props = [];
var escapeAll = false;
var valid = false;
var doneSearching = false;

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

// Login & logout functions
function login_printError(reason, id) {
	io.emit('login-complete', {"success": false, "reason": reason, "id": id});
}

function logout_printError(reason, id) {
	io.emit('logout-complete', {"success": false, "reason": reason, "id": id});
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
function cp_printError(reason, id) {
	io.emit('server-checked', {"success": false, "reason": reason, "id": id});
}

function cp_printSuccess(id) {
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
	var IP = socket.request.connection.remoteAddress;
	
	// REGISTRATION
	socket.on('register', function(data){
		user.isBanned(IP, function(err, banned) {
			if(err) {
				return console.log(err);
			}
			
			if(banned[0]) {
				return reg_printError("Please don't overload our servers.", Number('0.' + __line));
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
				return reg_printError("Invalid email and/or password.", Number('1.' + __line));
			} else if(((data.email).indexOf("@") != -1) && ((data.email).indexOf(".") != -1)) {
				bcrypt.genSalt(10, function(err, salt) {
					if(err) {
						return reg_printError(err, Number('2.' + __line));
					}
					
					// Hash password
					bcrypt.hash(data.pass, salt, function(err, hash) { 
						if(err) {
							return reg_printError(err, Number('3.' + __line));
						}
						
						fs.readdir("users", function(err, li) {
							if(err) {
								return reg_printError(err, Number('4.' + __line));
							}
							
							// Search the database to check if the user already exists
							li.forEach(function(file) {
								if(file != 'user.txt') {
									var dat = fs.readFileSync("users/" + file, 'utf8');
									values = dat.split("\n");
									if(values[0].trim() == data.email) {
										reg_printError("An account with this email has already been registered...", Number('5.' + __line));
										return escapeAll = true;
									}
								}
							});
							
							if(escapeAll) {
								escapeAll = false;
								return;
							}
							
							// User doesn't exist yet, register new user
							fs.readFile("users/user.txt", 'utf8', function(error, dat) {
								if(error) {
									return reg_printError(error, Number('6.' + __line));
								}
								
								values = dat.split("\n");
								
								// Add email & password to user file
								fs.writeFile("users/" + values[0].trim() + ".txt", data.email + "\n" + hash, function(err, data) {
									if(err) {
										return reg_printError(err, Number('7.' + __line));
									}
									
									// Make sure next user registered doesn't get the same user id
									fs.writeFile("users/user.txt", Number(values[0]) + 1, function(err, data) {
										if(err) {
											return reg_printError(err, Number('8.' + __line));
										}
										
										printSuccess()
									});
								});
							});
						});
					});
				});
			} else {
				reg_printError("This is impossible unless you hacked :/", Number('9.' + __line));
			}
		});
	});
	
	// LOGIN & LOGOUT
	socket.on('login', function(data){
		user.isBanned(IP, function(err, banned) {
			if(err) {
				return console.log(err);
			}
			
			if(banned[0]) {
				return login_printError("Please don't overload our servers.", Number('0.' + __line));
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
				return login_printError("Invalid email and/or password.", Number('1.' + __line));
			} else if(((data.email).indexOf("@") != -1) && ((data.email).indexOf(".") != -1)) {
				fs.readdir("users", function(err, li) {
					if(err) {
						return login_printError(err, Number('2.' + __line));
					}
					
					li.forEach(function(file) {
						if(file != 'user.txt') {
							var dat = fs.readFileSync("users/" + file, 'utf8');
							var currentFile = file.substring(0, file.length - 4);
							var esc = false;
							values = dat.split("\n");
							if(values[0].trim() == data.email) {
								dat = bcrypt.compareSync(data.pass, values[1].trim());
								if(dat) {
									var userSession = randomstring.generate(16);
									userSession += Math.round(((new Date()).getTime() / 60000) + 60*24);
									values[2] = userSession;
										
									fs.writeFileSync("users/" + currentFile + ".txt", values.join("\n"));
									io.emit('login-complete', {"success": true, "session": userSession});
									valid = true;
								} else {
									valid = false;
								}
								return esc = true;
							}
						}
							
						if(esc) {
							return;
						}
					});
				
					if(!valid) {
						return login_printError("Incorrect email and/or password", Number('3.' + __line));
					}
				});
			} else {
				login_printError("Invalid email.", Number('4.' + __line));
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
				return create_printError("Please don't overload our servers.", Number('0.' + __line));
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
				return create_printError("Invalid session ID.", Number('1.' + __line));
			} else if(Math.round((new Date).getTime() / 60000 > (data.session).substring(16))) {
				return create_printError("Session has expired.", Number('2.' + __line));
			} else if(data.type < 0 || data.type > 2) {
				return create_printError("Invalid server type.", Number('3.' + __line));
			} else if(typeof data.id == 'number') {
				
				// User id specified, get user session
				fs.readFile("users/" + data.id + ".txt", 'utf8', function(err, dat) {
					if(err) {
						return create_printError(err, Number('4.' + __line));
					}
					
					var values = dat.split("\n");
					
					// Check if session is valid
					if(values[2].trim() == data.session) {
						
						// Session valid, create server
						mkdir("servers/" + data.id, function(err) {
							if(err) {
								return create_printError(err, Number('5.' + __line));
							}
							
							fs.writeFile("servers/" + data.id + "/.properities", "0\n" + data.type + "\n0\n0", function(err, dat) {
								if(err) {
									return create_printError(err, Number('6.' + __line));
								}
								
								if(data.type == 0) {
									mcLib.addJar("servers/" + data.id, function(err) {
										if(err) {
											return create_printError(err, Number('7' + __line));
										}
										
										printSuccess();
									});
								}
							});
						});
					} else {
						create_printError("Unknown session.", Number('8.' + __line));
					}
				});
			} else {
				
				// User id not specified, look through every user file for a matching session
				fs.readdir("users", function(err, li) {
					if(err) {
						return create_printError(err, Number('9.' + __line));
					}
					
					li.forEach(function(file) {
						if(file != 'user.txt') {
							var dat = fs.readFileSync("users/" + file, 'utf8');
							var currentFile = file.substring(0, file.length - 5);
							var values = dat.split("\n");
							if(values[2].trim() == data.session) {
								
								// Session valid, create server
								mkdir("servers/" + currentFile, function(err) {
									if(err) {
										return create_printError(err, Number('10.' + __line));
									}
									
									fs.writeFile("servers/" + currentFile + "/.properities", "0\n" + data.type + "\n0\n0", function(err, dat) {
										if(err) {
											return create_printError(err, Number('11.' + __line));
										}
										
										if(data.type == 0) {
											mcLib.addJar("servers/" + data.id, function(err) {
												if(err) {
													return create_printError(err, Number('12.' + __line));
												}
												
												printSuccess();
												return doneSearching = true;
											});
										}
									});
								});
							} else {
								create_printError("Unknown session.", Number('13.' + __line));
							}
						}
				
						if(doneSearching) {
							return;
						}
					});
					
					if(doneSearching) {
						return;
					}
				});
				
				if(doneSearching) {
					doneSearching = false;
				} else {
					create_printError("Unknown session.", Number('14.' + __line));
				}
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
				return cp_printError("Please don't overload our servers.", Number('0.' + __line));
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
				return cp_printError("Invalid server ID and/or session ID.", Number('1.' + __line));
			}
			
			fs.readFile('servers/' + data.server + '/.properities', 'utf8', function(err, dat) {
				if (err) {
					return cp_printError(err, Number('2.' + __line));
				}
				
				props = dat.split("\n");
				var serv_isSleeping = boolify(props[0].trim());
				var serv_type = props[1].trim();
				var serv_typeCS = serv_type.substring(1, 2);
				var serv_rank = props[2].trim();
				var serv_timeOn = props[3].trim();
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
									return cp_printError(stderr, Number('3.' + __line));
								}
								
								printSuccess(serv_type);
							});
						} else if(serv_type.substring(0, 1) == 1) {
							// CS:GO
							
							if(serv_typeCS == 1) { // Classic Competive
								exec("./srcds_run -game csgo -console -usercon +game_type 0 +game_mode 1 +mapgroup mg_active +map de_dust2", function(err, out, stderr) {
									if(err) {
										return cp_printError(stderr, Number('4.' + __line));
									}
									
									printSuccess(serv_type);
								});
							} else if(serv_typeCS == 2) { // Arms Race
								exec("./srcds_run -game csgo -console -usercon +game_type 1 +game_mode 0 +mapgroup mg_armsrace +map ar_shoots", function(err, out, stderr) {
									if(err) {
										return cp_printError(stderr, Number('5.' + __line));
									}
									
									printSuccess(serv_type);
								});
							} else if(serv_typeCS == 3) { // Demolition
								exec("./srcds_run -game csgo -console -usercon +game_type 1 +game_mode 1 +mapgroup mg_demolition +map de_lake", function(err, out, stderr) {
									if(err) {
										return cp_printError(stderr, Number('6.' + __line));
									}
									
									printSuccess(serv_type);
								});
							} else if(serv_typeCS == 4) { // Deathmatch
								exec("./srcds_run -game csgo -console -usercon +game_type 1 +game_mode 2 +mapgroup mg_allclassic +map de_dust", function(err, out, stderr) {
									if(err) {
										return cp_printError(stderr, Number('7.' + __line));
									}
									
									printSuccess(serv_type);
								});
							} else { // Classic Casual
								exec("./srcds_run -game csgo -console -usercon +game_type 0 +game_mode 0 +mapgroup mg_active +map de_dust2", function(err, out, stderr) {
									if(err) {
										return cp_printError(stderr, Number('8.' + __line));
									}
									
									printSuccess(serv_type);
								});
							}
						} else if(serv_type == 2) {
							// TF2
							return cp_printError("WIP", Number('9.' + __line));
						} else {
							return cp_printError("Unknown server type", Number('10.' + __line));
						}
					} else {
						return cp_printError("ACCESS DENIED. But seriously, start your own server instead of others :P", Number('11.' + __line));
					}
				});
			});
		});
	});
});