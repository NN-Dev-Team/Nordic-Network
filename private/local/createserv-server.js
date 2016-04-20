var path = require('path');
var user = require('./user-extras.js');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var toobusy = require('toobusy-js');
var mkdir = require('mkdirp');

var doneSearching = false;

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
	if (toobusy()) {
		res.send(503, "Sorry, either we're too popular or someone is DDoS:ing (Server is overloaded)");
	} else {
		next();
	}
});

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/test-client-createserv.html'));
});

function printError(reason, id) {
	io.emit('creation-complete', {"success": false, "reason": reason, "id": id});
}

function printSuccess(id) {
	if(typeof id == 'number') {
		io.emit('creation-complete', {"success": true, "id": id});
	} else {
		io.emit('creation-complete', {"success": true});
	}
}

io.on('connection', function(socket){
	var IP = socket.request.connection.remoteAddress;
	socket.on('create-serv', function(data){
		user.isBanned(IP, function(err, banned) {
			if(err) {
				return console.log(err);
			}
			
			if(banned[0]) {
				return printError("Please don't overload our servers.", Number('0.' + __line));
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
				return printError("Invalid session ID.", Number('1.' + __line));
			} else if(Math.round((new Date).getTime() / 60000 > (data.session).substring(16))) {
				return printError("Session has expired.", Number('2.' + __line));
			} else if(data.type < 0 || data.type > 2) {
				return printError("Invalid server type.", Number('3.' + __line));
			} else if(typeof data.id == 'number') {
				
				// User id specified, get user session
				fs.readFile("../users/" + data.id + ".txt", 'utf8', function(err, dat) {
					if(err) {
						return printError(err, Number('4.' + __line));
					}
					
					var values = dat.split("\n");
					
					// Check if session is valid
					if(values[1].trim() == data.session) {
						
						// Session valid, create server
						mkdir("../servers/" + data.id, function(err) {
							if(err) {
								return printError(err, Number('5.' + __line));
							}
							
							fs.writeFile("../servers/" + data.id + "/.properities", data.session + "\n0\n" + data.type + "\n0\n0", function(err, data) {
								if(err) {
									return printError(err, Number('6.' + __line));
								}
								
								if(data.type == 0) {
									mcLib.addJar("../servers/" + data.id, function(err) {
										if(err) {
											return printError(err, Number('7' + __line));
										}
										
										printSuccess();
									});
								}
							});
						});
					} else {
						printError("Unknown session.", Number('8.' + __line));
					}
				});
			} else {
				
				// User id not specified, look through every user file for a matching session
				fs.readdir("../users", function(err, li) {
					if(err) {
						return printError(err, Number('9.' + __line));
					}
					
					li.forEach(function(file) {
						if(file != 'user.txt') {
							var dat = fs.readFileSync("../users/" + file, 'utf8');
							var currentFile = file.substring(0, file.length - 5);
							var values = dat.split("\n");
							if(values[1].trim() == data.session) {
								
								// Session valid, create server
								mkdir("../servers/" + currentFile, function(err) {
									if(err) {
										return printError(err, Number('10.' + __line));
									}
									
									fs.writeFile("../servers/" + currentFile + "/.properities", data.session + "\n0\n" + data.type + "\n0\n0", function(err, data) {
										if(err) {
											return printError(err, Number('11.' + __line));
										}
										
										mcLib.addJar("../servers/" + currentFile);
										printSuccess(currentFile);
										return doneSearching = true;
									});
								});
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
					printError("Unknown session.", Number('12.' + __line));
				}
			}
		});
	});
});