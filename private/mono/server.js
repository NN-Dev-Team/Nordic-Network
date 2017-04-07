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
var path = require('path');

var values = [];
var props = [];
var valid = false;

fs.readFile(path.join(__dirname, 'properties.txt'), 'utf8', function (err, data) {
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
		res.send(503, "TOO_MUCH_TRAFFIC");
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
				traffic_handler.log(socket_session, 64);
			} else {
				traffic_handler.register(socket_session, 64);
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
				traffic_handler.log(socket_session, 32);
			} else {
				traffic_handler.register(socket_session, 32);
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
				traffic_handler.log(socket_session, 32);
			} else {
				traffic_handler.register(socket_session, 32);
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
				return sendToClient('creation-complete', "TOO_MUCH_TRAFFIC", '3.0:' + __line);
			} else if(ss.isRegistered) {
				traffic_handler.log(socket_session, 64);
			} else {
				traffic_handler.register(socket_session, 64);
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
				return sendToClient('server-checked', "TOO_MUCH_TRAFFIC", '4.0:' + __line);
			} else if(ss.isRegistered) {
				traffic_handler.log(socket_session, 16);
			} else {
				traffic_handler.register(socket_session, 16);
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
				return sendToClient('server-stopped', "TOO_MUCH_TRAFFIC", '5.0:' + __line);
			} else if(ss.isRegistered) {
				traffic_handler.log(socket_session, 16);
			} else {
				traffic_handler.register(socket_session, 16);
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
				return sendToClient('console-query', "TOO_MUCH_TRAFFIC", '7.0:' + __line);
			} else if(ss.isRegistered) {
				traffic_handler.log(socket_session, 4);
			} else {
				traffic_handler.register(socket_session, 4);
			}
			
			server.sendCMD(data, IP, function(err, data) {
				if(err) {
					return sendToClient('console-query', err.error, formatErr(err, 7, __line));
				}
				
				sendToClient('console-query', data);
			});
        });
    });
	
	////////////////////////////////    APPLICATIONS    ////////////////////////////////
	
	socket.on('check-app', function(data) {
        traffic_handler.isBlocked(socket_session, function(ss) {
			if(ss.isBlocked) {
				return sendToClient('app-status', "TOO_MUCH_TRAFFIC", '7.0:' + __line);
			} else if(ss.isRegistered) {
				traffic_handler.log(socket_session, 64);
			} else {
				traffic_handler.register(socket_session, 64);
			}
			
			fs.writeFile(path.join(__dirname, '../apps/new/', data.id, '.txt'), data.app, function(err, dat) {
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
				return sendToClient('main-stats', "TOO_MUCH_TRAFFIC", '8.0:' + __line);
			} else if(ss.isRegistered) {
				traffic_handler.log(socket_session, 64);
			} else {
				traffic_handler.register(socket_session, 64);
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
						res.sendFile(path.join(__dirname, '/users/', data.id, '/server-page.html'), function(err) {
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
