var toobusy = require('toobusy-js');
var account = require('./lib/account-handler.js');
var server = require('./lib/server-handler.js');
var traffic_handler = require('./lib/traffic-handler.js');
var app_sorter = require('../app-sorter');
// var mcLib = require('./lib/auto-updater.js'); // ONLY RUNS ON LINUX
var fs = require('fs');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var exec = require('child_process').exec;
var Rcon = require('rcon');
var diskspace = require('diskspace');

var values = [];
var props = [];
var valid = false;

fs.readFile('./properties.txt', 'utf8', function (err, data) {
	if (err) {
		return console.log(err);
	}
	
	var port = process.env.PORT || data.trim();
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

// Reset traffic
setInterval(traffic_handler.resetTraffic, 4096);

// Send data to client
function sendToClient(name, data, id) {
	if(id) {
		io.emit(name, {"success": false, "error": data, "id": id});
	} else if(data) {
		io.emit(name, {"success": true, "info": data});
	} else {
		io.emit(name, {"success": true});
	}
}

// Send data to all clients
function broadcast(name, data, id) {
	if(id) {
		io.broadcast.emit(name, {"success": false, "error": data, "id": id});
	} else if(data) {
		io.broadcast.emit(name, {"success": true, "info": data});
	} else {
		io.broadcast.emit(name, {"success": true});
	}
}

function formatErr(err, id, line) {
	return id + '.' + err.id + ':' + line + '.' + err.line;
}

io.on('connection', function(socket){
	var IP = socket.request.connection.remoteAddress;
	var socket_session = socket.id;
	
	////////////////////////////////    ACCOUNT HANDLING    ////////////////////////////////
	
	
	// Registration
	socket.on('register', function(data){
		traffic_handler.isBlocked(socket_session, function(ss) {
			if(ss.isBlocked) {
				return sendToClient('reg-complete', "TOO_MUCH_TRAFFIC", '0.0:' + __line);
			} else if(ss.isRegistered) {
				traffic_handler.log(socket_session, 16);
			} else {
				traffic_handler.register(socket_session, 16);
			}
			
			account.register(data, IP, function(err, usr) {
				if(err) {
					return sendToClient('reg-complete', err.error, formatErr(err, 1, __line));
				}
				
				sendToClient('reg-complete');
				broadcast('main-stats', {"servers": usr});
			});
		});
	});
	
	// Login
	socket.on('login', function(data){
		traffic_handler.isBlocked(socket_session, function(ss) {
			if(ss.isBlocked) {
				return sendToClient('login-complete', "TOO_MUCH_TRAFFIC", '1.0:' + __line);
			} else if(ss.isRegistered) {
				traffic_handler.log(socket_session, 8);
			} else {
				traffic_handler.register(socket_session, 8);
			}
			
			account.login(data, IP, function(err, usr, userSession) {
				if(err) {
					return sendToClient('login-complete', err.error, formatErr(err, 2, __line));
				}
				
				sendToClient('login-complete', {"user": usr, "session": userSession});
			});
		});
	});
    
	// Logout
    socket.on('logout', function(data) {
        traffic_handler.isBlocked(socket_session, function(ss) {
			if(ss.isBlocked) {
				return sendToClient('logout-complete', "TOO_MUCH_TRAFFIC", '2.0:' + __line);
			} else if(ss.isRegistered) {
				traffic_handler.log(socket_session, 16);
			} else {
				traffic_handler.register(socket_session, 16);
			}
			
			account.logout(data, function(err) {
				if(err) {
					return sendToClient('logout-complete', err.error, formatErr(err, 3, __line));
				}
				
				sendToClient('logout-complete');
			});
        });
    });
	
	////////////////////////////////    SERVER CREATION    ////////////////////////////////
	
	socket.on('create-serv', function(data){
		traffic_handler.isBlocked(socket_session, function(ss) {
			if(ss.isBlocked) {
				return sendToClient('creation-complete', "Please don't overload our servers.", '3.0:' + __line);
			} else if(ss.isRegistered) {
				traffic_handler.log(socket_session, 16);
			} else {
				traffic_handler.register(socket_session, 16);
			}
			
			server.create(data, IP, function(err) {
				if(err) {
					return sendToClient('creation-complete', err.error, formatErr(err, 4, __line));
				}
				
				sendToClient('creation-complete');
			});
		});
	});
	
	////////////////////////////////    CONTROL PANEL    ////////////////////////////////
	
	socket.on('start-server', function(data){
		traffic_handler.isBlocked(socket_session, function(ss) {
			if(ss.isBlocked) {
				return sendToClient('server-checked', "Please don't overload our servers.", '4.0:' + __line);
			} else if(ss.isRegistered) {
				traffic_handler.log(socket_session, 8);
			} else {
				traffic_handler.register(socket_session, 8);
			}
			
			server.start(data, IP, function(err, serv_type) {
				if(err) {
					return sendToClient('server-checked', err.error, formatErr(err, 5, __line));
				}
				
				sendToClient('server-checked', serv_type);
			});
		});
	});
	
	socket.on('stop-server', function(data) {
		traffic_handler.isBlocked(socket_session, function(ss) {
			if(ss.isBlocked) {
				return sendToClient('server-stopped', "Please don't overload our servers.", '5.0:' + __line);
			} else if(ss.isRegistered) {
				traffic_handler.log(socket_session, 8);
			} else {
				traffic_handler.register(socket_session, 8);
			}
			
			server.stop(data, IP, function(err) {
				if(err) {
					return sendToClient('server-stopped', err.error, formatErr(err, 6, __line));
				}
				
				sendToClient('server-stopped');
			});
		});
	});
	
	socket.on('console-cmd', function(data) {
		traffic_handler.isBlocked(socket_session, function(ss) {
			if(ss.isBlocked) {
				return sendToClient('console-query', "Please don't overload our servers.", '6.0:' + __line);
			} else if(ss.isRegistered) {
				traffic_handler.log(socket_session, 4);
			} else {
				traffic_handler.register(socket_session, 4);
			}
			
			if(typeof data.session != 'string' || (data.session).length < 24) {
				return console.log("[!] Possible hacker detected (with IP: " + IP + ")");
			} else if(Math.round((new Date).getTime() / 60000 > (data.session).substring(16))) {
				return sendToClient('console-query', "Session has expired.", '15.' + __line);
			} else if(typeof data.id == 'number') {
				
				// Get user data
				user.get(data.id, function(err, line, dat) {
					if(err) {
						return sendToClient('console-query', err, '26.' + __line + '.' + line);
					}
					
					// Check if session is valid
					if(dat[2].trim() == data.session && dat[2].trim() != "SESSION EXPIRED") {
						
						// Session valid, get server data
						fs.readFile(__dirname + 'users/' + data.server + '/server/server.properties', 'utf8', function(err, dat) {
							if (err) {
								return sendToClient('console-query', err, '27.' + __line);
							}
							
							props = data.split("\n");
							var serv_type = props[1].trim();
							var serv_IP = "";
							var rcon_port = 0;
							var rcon_pass = "";
							
							if(serv_type == 0) {
								
								// Minecraft
								fs.readFile(__dirname + 'users/' + data.id + '/server/server.properties', 'utf8', function(err, dat) {
									if(err) {
										return sendToClient('console-query', err, '28.' + __line);
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
										return sendToClient('console-query', err, '29.' + __line);
									});
									
									conn.connect();
								});
							} else {
								return sendToClient('console-query', "This game does not support RCON :(", '30.' + __line);
							}
						});
                    } else {
                        return sendToClient('console-query', "Invalid session.", '21.' + __line);
                    }
                });
            } else {
				return console.log("[!] Possible hacker detected (with IP: " + IP + ")");
            }
        });
    });
	
	////////////////////////////////    APPLICATIONS    ////////////////////////////////
	
	socket.on('check-app', function(data) {
        traffic_handler.isBlocked(socket_session, function(ss) {
			if(ss.isBlocked) {
				return sendToClient('app-status', "Please don't overload our servers.", '7.0:' + __line);
			} else if(ss.isRegistered) {
				traffic_handler.log(socket_session, 16);
			} else {
				traffic_handler.register(socket_session, 16);
			}
			
			fs.writeFile(__dirname + '../apps/new/' + data.id + '.txt', data.app, function(err, dat) {
				if(err) {
					return sendToClient('app-status', err, '31.' + __line);
				}
				
				app_sorter.checkApp(data.id, function(err, approved) {
					if(err) {
						return sendToClient('app-status', err, '32.' + __line);
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
	
	////////////////////////////////    INDEX    ////////////////////////////////
	
	socket.on('get-main-stats', function(data) {
        traffic_handler.isBlocked(socket_session, function(ss) {
			if(ss.isBlocked) {
				return sendToClient('main-stats', "Please don't overload our servers.", '8.0:' + __line);
			} else if(ss.isRegistered) {
				traffic_handler.log(socket_session, 16);
			} else {
				traffic_handler.register(socket_session, 16);
			}
            
            user.getTotal(function(err, serverCount) {
                exec("free -m", function(err, out, stderr) {
                    if(err) {
                        return console.log(err);
                    }
                    
                    var c = out.indexOf("-/+ buffers/cache");
                    
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
	
	////////////////////////////////    USER & SERVER PAGES    ////////////////////////////////
	
	socket.on('get-user-page', function(data){
		user.getTotal(function(err, userCount) {
			if(data.id < user_count) {
				app.get('/', function(req, res) {
					if(data.pageType == 0) {
						res.sendFile(__dirname + '/users/' + data.id + '/server-page.html', function(err) {
							if(err) {
								return io.emit('show-404');
							}
						});
					} else if(data.pageType == 1) {
						// Forum or something here maybe? Or user page?
					}
				});
			} else {
				return io.emit('show-404');
			}
		});
	});
	
	////////////////////////////////    DISCONNECTION HANDLING    ////////////////////////////////
	
	socket.on('disconnect', function() {
		traffic_handler.removeSession(socket_session);
	});
});
