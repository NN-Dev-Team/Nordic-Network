var toobusy = require('toobusy-js');
var user = require('./lib/user-lib.js');
var account = require('./lib/account-handler.js');
var server = require('./lib/server-handler.js');
var traffic_handler = require('./lib/traffic-handler.js');
var stats = require('./lib/stats.js');
var app_sorter = require('./lib/app-sorter');
var fs = require('fs');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

var values = [];
var props = [];
var valid = false;

fs.readFile(path.join(__dirname, 'properties.txt'), 'utf8', function (err, data) {
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
		res.send(503, "TOO_MUCH_TRAFFIC");
	} else {
		next();
	}
});

// Reset traffic
setInterval(traffic_handler.resetTraffic, 4096);

// Send data to client
function sendToClient(socket, name, data, id) {
	if(id) {
		socket.emit(name, {"success": false, "error": data, "id": id});
	} else if(data) {
		socket.emit(name, {"success": true, "info": data});
	} else {
		socket.emit(name, {"success": true});
	}
}

// Send data to all clients
function broadcast(socket, name, data, id) {
	if(id) {
		socket.broadcast.emit(name, {"success": false, "error": data, "id": id});
	} else if(data) {
		socket.broadcast.emit(name, {"success": true, "info": data});
	} else {
		socket.broadcast.emit(name, {"success": true});
	}
}

function formatErr(err, id, line) {
	return id + '.' + err.id + ':' + line + '.' + err.line;
}

io.on('connection', function(socket){
	var IP = socket.request.connection.remoteAddress;
	
	////////////////////////////////    ACCOUNT HANDLING    ////////////////////////////////
	
	
	// Registration
	socket.on('register', function(data){
		traffic_handler.isBlocked(IP, function(ss) {
			if(ss.isBlocked) {
				return sendToClient(socket, 'reg-complete', "TOO_MUCH_TRAFFIC", '0.0:' + __line);
			} else if(ss.isRegistered) {
				traffic_handler.log(IP, 64);
			} else {
				traffic_handler.register(IP, 64);
			}
			
			account.register(data, IP, function(err, usr) {
				if(err) {
					return sendToClient(socket, 'reg-complete', err.error, formatErr(err, 0, __line));
				}
				
				sendToClient(socket, 'reg-complete');
				broadcast(socket, 'main-stats', {"servers": usr});
			});
		});
	});
	
	// Login
	socket.on('login', function(data){
		traffic_handler.isBlocked(IP, function(ss) {
			if(ss.isBlocked) {
				return sendToClient(socket, 'login-complete', "TOO_MUCH_TRAFFIC", '1.0:' + __line);
			} else if(ss.isRegistered) {
				traffic_handler.log(IP, 32);
			} else {
				traffic_handler.register(IP, 32);
			}
			
			account.login(data, IP, function(err, usr, userSession) {
				if(err) {
					return sendToClient(socket, 'login-complete', err.error, formatErr(err, 1, __line));
				}
				
				sendToClient(socket, 'login-complete', {"user": usr, "session": userSession});
			});
		});
	});
    
	// Logout
    socket.on('logout', function(data) {
        traffic_handler.isBlocked(IP, function(ss) {
			if(ss.isBlocked) {
				return sendToClient(socket, 'logout-complete', "TOO_MUCH_TRAFFIC", '2.0:' + __line);
			} else if(ss.isRegistered) {
				traffic_handler.log(IP, 32);
			} else {
				traffic_handler.register(IP, 32);
			}
			
			account.logout(data, IP, function(err) {
				if(err) {
					return sendToClient(socket, 'logout-complete', err.error, formatErr(err, 2, __line));
				}
				
				sendToClient(socket, 'logout-complete');
			});
        });
    });
	
	////////////////////////////////    SERVER CREATION    ////////////////////////////////
	
	socket.on('create-serv', function(data){
		traffic_handler.isBlocked(IP, function(ss) {
			if(ss.isBlocked) {
				return sendToClient(socket, 'creation-complete', "TOO_MUCH_TRAFFIC", '3.0:' + __line);
			} else if(ss.isRegistered) {
				traffic_handler.log(IP, 64);
			} else {
				traffic_handler.register(IP, 64);
			}
			
			server.create(data, IP, function(err, usr) {
				if(err) {
					return sendToClient(socket, 'creation-complete', err.error, formatErr(err, 3, __line));
				}
				
				sendToClient(socket, 'creation-complete', {"id": usr});
			});
		});
	});
	
	////////////////////////////////    CONTROL PANEL    ////////////////////////////////
	
	socket.on('start-server', function(data){
		traffic_handler.isBlocked(IP, function(ss) {
			if(ss.isBlocked) {
				return sendToClient(socket, 'server-checked', "TOO_MUCH_TRAFFIC", '4.0:' + __line);
			} else if(ss.isRegistered) {
				traffic_handler.log(IP, 16);
			} else {
				traffic_handler.register(IP, 16);
			}
			
			server.start(data, IP, function(err, serv_type) {
				if(err) {
					return sendToClient(socket, 'server-checked', err.error, formatErr(err, 4, __line));
				}
				
				sendToClient(socket, 'server-checked', serv_type);
			});
		});
	});
	
	socket.on('stop-server', function(data) {
		traffic_handler.isBlocked(IP, function(ss) {
			if(ss.isBlocked) {
				return sendToClient(socket, 'server-stopped', "TOO_MUCH_TRAFFIC", '5.0:' + __line);
			} else if(ss.isRegistered) {
				traffic_handler.log(IP, 16);
			} else {
				traffic_handler.register(IP, 16);
			}
			
			server.stop(data, IP, function(err) {
				if(err) {
					return sendToClient(socket, 'server-stopped', err.error, formatErr(err, 5, __line));
				}
				
				sendToClient(socket, 'server-stopped');
			});
		});
	});
	
	socket.on('console-cmd', function(data) {
		traffic_handler.isBlocked(IP, function(ss) {
			if(ss.isBlocked) {
				return sendToClient(socket, 'console-query', "TOO_MUCH_TRAFFIC", '6.0:' + __line);
			} else if(ss.isRegistered) {
				traffic_handler.log(IP, 4);
			} else {
				traffic_handler.register(IP, 4);
			}
			
			server.sendCMD(data, IP, function(err, data) {
				if(err) {
					return sendToClient(socket, 'console-query', err.error, formatErr(err, 6, __line));
				}
				
				sendToClient(socket, 'console-query', data);
			});
        });
    });
	
	////////////////////////////////    APPLICATIONS    ////////////////////////////////
	
	socket.on('check-app', function(data) {
        traffic_handler.isBlocked(IP, function(ss) {
			if(ss.isBlocked) {
				return sendToClient(socket, 'app-status', "TOO_MUCH_TRAFFIC", '7.0:' + __line);
			} else if(ss.isRegistered) {
				traffic_handler.log(IP, 64);
			} else {
				traffic_handler.register(IP, 64);
			}
			
			if(!data || typeof data.id != 'number' || typeof data.app != 'string') {
				return console.log("[!] Possible hacker detected (with IP: " + IP + ")");
			}
			
			fs.writeFile(path.join(__dirname, 'apps/new/', data.id.toString(), '.txt'), data.app, function(err, dat) {
				if(err) {
					return sendToClient(socket, 'app-status', err, '7.1:' + __line);
				}
				
				app_sorter.checkApp(data.id.toString(), function(err, approved) {
					if(err) {
						return sendToClient(socket, 'app-status', err.error, '7.2:' + __line + "." + err.line);
					}
					
					if(approved) {
						sendToClient(socket, 'app-status');
					} else {
						return console.log("[!!] Possible hacker detected (with IP: " + IP + ")");
					}
				});
			});
		});
	});
	
	////////////////////////////////    INDEX    ////////////////////////////////
	
	socket.on('get-main-stats', function() {
        traffic_handler.isBlocked(IP, function(ss) {
			if(ss.isBlocked) {
				return sendToClient(socket, 'main-stats', "TOO_MUCH_TRAFFIC", '8.0:' + __line);
			} else if(ss.isRegistered) {
				traffic_handler.log(IP, 64);
			} else {
				traffic_handler.register(IP, 64);
			}
            
            stats.getMain(function(err, serverCount, mem_max, mem_used) {
				if(err) {
					return sendToClient(socket, 'main-stats', err.error, formatError(err, 8, __line));
				}
				
                sendToClient(socket, 'main-stats', {"servers": serverCount, "max": mem_max, "used": mem_used});
            });
        });
	});
	
	////////////////////////////////    USER & SERVER PAGES    ////////////////////////////////
	
	socket.on('get-user-page', function(data){
		if(!data || typeof data.id != 'number' || typeof data.pageType != 'number') {
			return console.log("[!] Possible hacker detected (with IP: " + IP + ")");
		}
		
		user.getTotal(function(err, userCount) {
			if(err) {
				return socket.emit('show-404');
			}
			
			if(data.id < user_count) {
				app.get('/', function(req, res) {
					if(data.pageType == 0) {
						res.sendFile(path.join(__dirname, '/users/', data.id.toString(), '/server-page.html'), function(err) {
							if(err) {
								return socket.emit('show-404');
							}
						});
					} else if(data.pageType == 1) {
						// Forum or something here maybe? Or user page?
					}
				});
			} else {
				return socket.emit('show-404');
			}
		});
	});
	
	////////////////////////////////    DISCONNECTION HANDLING    ////////////////////////////////
	
	socket.on('disconnect', function() {
		traffic_handler.removeIP(IP);
	});
});
