var path = require('path');
var user = require('user-extras.js');
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

function printError(reason, id, IP, time) {
	io.emit('creation-complete', {"success": false, "reason": reason, "id": id});
/*	if(typeof IP != 'undefined') {
		if(typeof time != 'number') {
			time = 1023;
		}
		
		fsExt.addLine("../bans.txt", IP + " " + ((new Date()).getTime() + time), function(err, data) {
			if(err) {
				console.log(err);
			}
		});
	} */
}

function printSuccess(IP, id, time) {
	if(typeof id == 'number') {
		io.emit('creation-complete', {"success": true, "id": id});
	} else {
		io.emit('creation-complete', {"success": true});
	}
	
/*	if(typeof IP != 'undefined') {
		if(typeof time != 'number') {
			time = 1023;
		}
		
		fsExt.addLine("../bans.txt", IP + " " + ((new Date()).getTime() + time), function(err, data) {
			if(err) {
				console.log(err);
			}
		});
	} */
}

io.on('connection', function(socket){
	var IP = socket.request.connection.remoteAddress;
	socket.on('create-serv', function(data){
/*		fsExt.fileContains("../bans.txt", IP, function(err, banned) {
			if(err) {
				return console.log(err);
			}
			
			if(banned) {
				return printError("Please don't overload our servers.", Number('0.' + __line));
			} else if(typeof data.session != 'string' || (data.session).length < 24) {
				return printError("Invalid session ID.", Number('1.' + __line), IP, 131071);
			} else if(Math.round((new Date).getTime() / 60000 > (data.session).substring(16))) {
				return printError("Session has expired.", Number('2.' + __line), IP, 524287);
			} else if(data.type < 0 || data.type > 2) {
				return printError("Invalid server type.", Number('3.' + __line), IP, 65535);
			} */
			
			// Check if user id was specified
			if(typeof data.id == 'number') {
				
				// User id specified, get user session
				fs.readFile("../users/" + data.id + ".txt", 'utf8', function(err, dat) {
					if(err) {
						return printError(err, Number('4.' + __line), IP, 131071);
					}
					
					var values = dat.split("\n");
					
					// Check if session is valid
					if(values[1].trim() == data.session) {
						
						// Session valid, create server
						mkdir("../servers/" + data.id, function(err) {
							if(err) {
								return printError(err, Number('5.' + __line), IP);
							}
							
							fs.writeFile("../servers/" + data.id + "/.properities", data.session + "\n0\n" + data.type + "\n0\n0", function(err, data) {
								if(err) {
									return printError(err, Number('6.' + __line), IP);
								}
								
								printSuccess(IP);
							});
						});
					} else {
						printError("Unknown session.", Number('7.' + __line), IP, 262143);
					}
				});
			} else {
				
				// User id not specified, look through every user file for a matching session
				fs.readdir("../users", function(err, li) {
					if(err) {
						return printError(err, Number('8.' + __line), IP);
					}
					
					li.forEach(function(file) {
						if(file != 'user.txt') {
							var dat = fs.readFileSync("../users/" + file, 'utf8');
							var currentFile = file.substring(0, file.length - 5);
							var values = dat.split("\n");
							if(values[1].trim() == data.session) {
								
								var currentFile = file.substring(0, file.length - 5);
								
								// Session valid, create server
								mkdir("../servers/" + currentFile, function(err) {
									if(err) {
										return printError(err, Number('9.' + __line), IP);
									}
									
									fs.writeFile("../servers/" + currentFile + "/.properities", data.session + "\n0\n" + data.type + "\n0\n0", function(err, data) {
										if(err) {
											return printError(err, Number('10.' + __line), IP);
										}
										
										printSuccess(IP, currentFile);
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
					printError("Unknown session.", Number('11.' + __line), IP, 262143);
				}
			}
/*		}); */
	});
});