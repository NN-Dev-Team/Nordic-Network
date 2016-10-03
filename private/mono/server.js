var toobusy = require('toobusy-js');
var user = require('./user-lib.js');
var app_sorter = require('../app-sorter');
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
var diskspace = require('diskspace');

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

// Send data to client
function sendToClient(name, data, id) {
	if(id) {
		io.emit(name, {"success": false, "reason": data, "id": id});
	} else if(data) {
		io.emit(name, {"success": true, "info": data});
	} else {
		io.emit(name, {"success": true});
	}
}

// Send data to all clients
function broadcast(name, data, id) {
	if(id) {
		io.broadcast.emit(name, {"success": false, "reason": data, "id": id});
	} else if(data) {
		io.broadcast.emit(name, {"success": true, "info": data});
	} else {
		io.broadcast.emit(name, {"success": true});
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
				return sendToClient('reg-complete', "Please don't overload our servers.", '0.' + __line);
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
				return console.log("[!] Possible hacker detected (with IP: " + IP + ")");
			} else if(((data.email).indexOf("@") != -1) && ((data.email).indexOf(".") != -1)) {
				bcrypt.genSalt(10, function(err, salt) {
					if(err) {
						return sendToClient('reg-complete', err, '1.' + __line);
					}
					
					// Hash password
					bcrypt.hash(data.pass, salt, function(err, hash) { 
						if(err) {
							return sendToClient('reg-complete', err, '2.' + __line);
						}
						
						// Search the database to check if the user already exists
						user.find(data.email, function(err, line, found, dat, last, usr) {
							if(err) {
								return sendToClient('reg-complete', err, '3.' + __line + '.' + line);
							}
							
							if(found) {
								return sendToClient('reg-complete', "An account with this email has already been registered...", '4.' + __line);
							}
							
							// User doesn't exist yet, check if enough disk space is available
							diskspace.check('/', function (err, total, free) {
								if(free < 2147483648) {
									return sendToClient('reg-complete', "Not enough diskspace.", '5.' + __line);
								} else {
									
									// Enough disk space available, register user
									user.add(usr, data.email, hash, function(err, line) {
										if(err) {
											return sendToClient('reg-complete', err, '6.' + __line + '.' + line);
										}
										
										sendToClient('reg-complete');
										broadcast('main-stats', {"servers": usr});
									});
								}
							});
						});
					});
				});
			} else {
				return console.log("[!] Possible hacker detected (with IP: " + IP + ")");
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
				return sendToClient('login-complete', "Please don't overload our servers.", '7.' + __line);
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
				return console.log("[!] Possible hacker detected (with IP: " + IP + ")");
			} else if(((data.email).indexOf("@") != -1) && ((data.email).indexOf(".") != -1)) {
				user.find(data.email, function(err, line, found, dat, usr) {
					if(err) {
						return sendToClient('login-complete', err, '8.' + __line + '.' + line);
					}
					
					if(found) {
						bcrypt.compare(data.pass, dat[1].trim(), function(err, valid) {
							if(err) {
								return sendToClient('login-complete', err, '9.' + __line);
							}
							
							if(valid) {
								var userSession = randomstring.generate(16);
								userSession += Math.round(((new Date()).getTime() / 60000) + 60*24);
								dat[2] = userSession;
								
								fs.writeFile("users/" + usr + "/user.txt", dat.join("\n"), function(err, data) {
									if(err) {
										return sendToClient('login-complete', err, '10.' + __line);
									}
									
									sendToClient('login-complete', {"user": usr, "session": userSession});
								});
							} else {
								return sendToClient('login-complete', "Incorrect email and/or password.", '11.' + __line);
							}
						});
					} else {
						return sendToClient('login-complete', "Incorrect email and/or password.", '12.' + __line);
					}
				});
			} else {
				return console.log("[!] Possible hacker detected (with IP: " + IP + ")");
			}
		});
	});
    
    socket.on('logout', function(data) {
        user.isBanned(IP, function(err, banned) {
			if(err) {
				return console.log(err);
			}
			
			if(banned[0]) {
				return sendToClient('logout-complete', "Please don't overload our servers.", '13.' + __line);
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
            
            user.get(data.id, function(err, line, dat) {
				if(err) {
				    return sendToClient('logout-complete', err, '14.' + __line + '.' + line);
				}
                
                if(dat[2].trim() == data.session && dat[2].trim() != "SESSION EXPIRED") {
                    user.changeProp(data.id, 2, "SESSION EXPIRED", function(err, line) {
                        if(err) {
                            return sendToClient('logout-complete', err, '15.' + __line + '.' + line);
                        }
                        
                        sendToClient('logout-complete');
                    });
                }
            });
        });
    });
	
	// SERVER CREATION
	socket.on('create-serv', function(data){
		user.isBanned(IP, function(err, banned) {
			if(err) {
				return console.log(err);
			}
			
			if(banned[0]) {
				return sendToClient('creation-complete', "Please don't overload our servers.", '16.' + __line);
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
				return console.log("[!] Possible hacker detected (with IP: " + IP + ")");
			} else if(Math.round((new Date).getTime() / 60000 > (data.session).substring(16))) {
				return sendToClient('creation-complete', "Session has expired.", '17.' + __line);
			} else if(data.type < 0 || data.type > 2) {
				return sendToClient('creation-complete', "Invalid server type.", '18.' + __line);
			} else if(typeof data.id == 'number') {
				
				// User id specified, get user session
				user.get(data.id, function(err, line, dat) {
					if(err) {
						return sendToClient('creation-complete', err, '19.' + __line + '.' + line);
					}
					
					// Check if session is valid
					if(dat[2].trim() == data.session && dat[2].trim() != "SESSION EXPIRED") {
						
						// Session valid, create server
						mkdir("users/" + data.id + "/server", function(err) {
							if(err) {
								return sendToClient('creation-complete', err, '20.' + __line);
							}
							
							fs.writeFile("users/" + data.id + "/server/.properities", "0\n" + data.type + "\n0\n0", function(err, dat) {
								if(err) {
									return sendToClient('creation-complete', err, '21.' + __line);
								}
								
								if(data.type == 0) {
									mcLib.addJar("servers/" + data.id, function(err) {
										if(err) {
											return sendToClient('creation-complete', err, '22' + __line);
										}
										
										sendToClient('creation-complete');
									});
								}
							});
						});
					} else {
						sendToClient('creation-complete', "Unknown session.", '23.' + __line);
					}
				});
			} else {
				return sendToClient('creation-complete', "User id not specified.", '24.' + __line);
				
				// User id not specified, look through every user file for a matching session
				// !! OUTDATED !!
/*				user.findSession(data.session, function(err, line, found, usr) {
					if(err) {
						return sendToClient('creation-complete', err, '9.' + __line + '.' + line);
					}
					
					if(found) {
						// Session valid, create server
						mkdir("servers/" + usr, function(err) {
							if(err) {
								return sendToClient('creation-complete', err, '10.' + __line);
							}
							
							fs.writeFile("servers/" + usr + "/.properities", "0\n" + data.type + "\n0\n0", function(err, dat) {
								if(err) {
									return sendToClient('creation-complete', err, '11.' + __line);
								}
								
								if(data.type == 0) {
									mcLib.addJar("servers/" + usr, function(err) {
										if(err) {
											return sendToClient('creation-complete', err, '12.' + __line);
										}
										
										sendToClient('creation-complete');
									});
								}
							});
						});
					} else {
						sendToClient('creation-complete', "Unknown session.", '13.' + __line);
					}
				}); */
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
				return sendToClient('server-checked', "Please don't overload our servers.", '25.' + __line);
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
				return console.log("[!] Possible hacker detected (with IP: " + IP + ")");
			}
			
			fs.readFile('users/' + data.server + '/server/.properities', 'utf8', function(err, dat) {
				if (err) {
					return sendToClient('server-checked', err, '26.' + __line);
				}
				
				props = dat.split("\n");
				var serv_isSleeping = boolify(props[0].trim());
				var serv_type = props[1].trim();
				var serv_rank = props[2].trim();
				var serv_timeOn = props[3].trim(); // Will not be used in this case, it's just here so we can remember it
				var serv_lastOn = props[4].trim(); // Will not be used in this case, it's just here so we can remember it
				var serv_ram = [[256, 512, 1024, 2048, 4096], [512, 1024, 2048, 4096], [512, 1024, 2048, 4096]];
				
				fs.readFile('users/' + data.server + "/user.txt", 'utf8', function(err, dat) {
					props = dat.split("\n");
					var user_session = props[2].trim();
					
					// Check if session is matching
					if(user_session == data.session && user_session != "SESSION EXPIRED") {
						
						// Run server
						if(serv_type == 0) {
							// Minecraft PC
							
							exec("java -Xmx" + serv_ram[serv_type][serv_rank] + "M -Xms" + serv_ram[serv_type][serv_rank] + "M -jar servers/" + data.server + "/minecraft_server.jar nogui", function(err2, out, stderr) {
								if(err2) {
									return sendToClient('server-checked', stderr, '27.' + __line);
								}
								
								sendToClient('server-checked', serv_type);
							});
						} else if(serv_type == 1) {
							// Minecraft PE
						} else {
							// Minecraft Win 10
						}
					} else {
						return sendToClient('server-checked', "Invalid session.", '28.' + __line);
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
				return sendToClient('server-stopped', "Please don't overload our servers.", '29.' + __line);
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
				return console.log("[!] Possible hacker detected (with IP: " + IP + ")");
			}
			
			fs.readFile('users/' + data.server + '/server/.properities', 'utf8', function(err, dat) {
				if (err) {
					return sendToClient('server-stopped', err, '30.' + __line);
				}
				
				props = dat.split("\n");
				var serv_isSleeping = boolify(props[0].trim());
				var serv_type = props[1].trim();
				var serv_rank = props[2].trim();
				var serv_timeOn = props[3].trim();
				var serv_IP = "";
				var rcon_port = 0;
				var rcon_pass = "";
				var serv_ram = [[256, 512, 1024, 2048, 4096], [512, 1024, 2048, 4096], [512, 1024, 2048, 4096]];
				
				fs.readFile('users/' + data.server + "/user.txt", 'utf8', function(err, dat) {
					props = dat.split("\n");
					var user_session = props[2].trim();
					
					// Check if session is matching
					if(user_session == data.session && user_session != "SESSION EXPIRED") {
						if(serv_type == 0) {
							// Minecraft PC
							
							fs.readFile('users/' + data.server + '/server/server.properities', 'utf8', function(err, data) {
								if(err) {
									return sendToClient('server-stopped', err, '31.' + __line);
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
									sendToClient('server-stopped');
								});
								
								conn.connect();
							});
						} else if(serv_type == 1) {
							// Minecraft PE
						} else {
							// Minecraft Win 10
						}
					} else {
						return sendToClient('server-stopped', "Invalid session.", '32.' + __line);
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
				return sendToClient('console-query', "Please don't overload our servers.", '33.' + __line);
			} else if(banned[1]) {
				user.addIP(IP, function(err) {
					if(err) {
						console.log(err);
					}
					
					user.incrUsage(IP, 4);
				});
			} else {
				user.incrUsage(IP, 4);
			}
			
			if(typeof data.session != 'string' || (data.session).length < 24) {
				return console.log("[!] Possible hacker detected (with IP: " + IP + ")");
			} else if(Math.round((new Date).getTime() / 60000 > (data.session).substring(16))) {
				return sendToClient('console-query', "Session has expired.", '34.' + __line);
			} else if(typeof data.id == 'number') {
				
				// Get user data
				user.get(data.id, function(err, line, dat) {
					if(err) {
						return sendToClient('console-query', err, '35.' + __line + '.' + line);
					}
					
					// Check if session is valid
					if(dat[2].trim() == data.session && dat[2].trim() != "SESSION EXPIRED") {
						
						// Session valid, get server data
						fs.readFile('users/' + data.server + '/server/server.properities', 'utf8', function(err, dat) {
							if (err) {
								return sendToClient('console-query', err, '36.' + __line);
							}
							
							props = data.split("\n");
							var serv_type = props[1].trim();
							var serv_IP = "";
							var rcon_port = 0;
							var rcon_pass = "";
							
							if(serv_type == 0) {
								
								// Minecraft
								fs.readFile('users/' + data.id + '/server/server.properities', 'utf8', function(err, dat) {
									if(err) {
										return sendToClient('console-query', err, '37.' + __line);
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
										sendToClient('console-query', data);
									}).on('error', function(err) {
										return sendToClient('console-query', err, '38.' + __line);
									});
									
									conn.connect();
								});
							} else {
								return sendToClient('console-query', "This game does not support RCON :(", '39.' + __line);
							}
						});
                    } else {
                        return sendToClient('console-query', "Invalid session.", '40.' + __line);
                    }
                });
            } else {
				return console.log("[!] Possible hacker detected (with IP: " + IP + ")");
            }
        });
    });
	
	// APPLICATIONS
	socket.on('check-app', function(data) {
        user.isBanned(IP, function(err, banned) {
			if(err) {
				return console.log(err);
			}
			
			if(banned[0]) {
				return sendToClient('app-status', "Please don't overload our servers.", '41.' + __line);
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
			
			fs.writeFile('../apps/new/' + data.id + '.txt', data.app, function(err, dat) {
				if(err) {
					return sendToClient('app-status', err, '42.' + __line);
				}
				
				app_sorter.checkApp(data.id, function(err, approved) {
					if(err) {
						return sendToClient('app-status', err, '43.' + __line);
					}
					
					if(approved) {
						sendToClient('app-status');
					} else {
						return console.log("[!!] Possible hacker detected (with IP: " + IP + ")");
					}
				});
			});
		});
	});
	
	// INDEX
	
	socket.on('get-main-stats', function(data) {
        user.isBanned(IP, function(err, banned) {
			if(err) {
				return console.log(err);
			}
			
			if(banned[0]) {
				return sendToClient('main-stats', "Please don't overload our servers.", '44.' + __line);
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
            
            user.getTotal(function(err, serverCount) {
                exec("free -m", function(err, out, stderr) {
                    if(err) {
                        return sendToClient('main-stats', stderr, '45.' + __line);
                    }
                    
                    var c = out.indexOf("Mem");
                    
                    while(!(Number(out[c]))) {
                        c++;
                    }
                    
                    var mem_max = "";
                    
                    while(Number(out[c])) {
                        mem_max += out[c];
                        c++;
                    }
                    
                    while(!(Number(out[c]))) {
                        c++;
                    }
                    
                    var mem_used = "";
                    
                    while(Number(out[c])) {
                        mem_used += out[c];
                        c++;
                    }
                    
                    sendToClient('main-stats', {"servers": serverCount, "max": mem_max, "used": mem_used});
                });
            });
        });
	});
});