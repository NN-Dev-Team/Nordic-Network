var path = require('path');
var fsExt = require('../fsPlus.js');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var bcrypt = require('bcryptjs');
var toobusy = require('toobusy-js');

var values = [];
var props = [];
var escapeAll = false;

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
    res.sendFile(path.join(__dirname + '/test-client-reg.html'));
});

function printError(reason, id, time, IP) {
	io.emit('reg-complete', {"success": false, "reason": reason, "id": id});
	
	if(typeof IP == 'string') {
		if(typeof time != 'number') {
			time = 1023;
		}
		
		var result = fsExt.addLine("../bans.txt", IP + " " + ((new Date()).getTime + time));
		if(result) {
			console.log(result);
		}
	}
}

function printSuccess(IP, time) {
	io.emit('reg-complete', {"success": true});
	
	if(typeof IP == 'string') {
		if(typeof time != 'number') {
			time = 1023;
		}
		
		var result = fsExt.addLine("../bans.txt", IP + " " + ((new Date()).getTime + time));
		if(result) {
			console.log(result);
		}
	}
}

io.on('connection', function(socket){
	var IP = socket.request.connection.remoteAddress;
	socket.on('register', function(data){
		fsExt.fileContains("../bans.txt", IP, function(err, banned) {
			if(err) {
				return console.log(err);
			}
			
			if(banned) {
				return printError("Please don't overload our servers.", Number('0.' + __line));
			} else if(typeof data.email != 'string' || typeof data.pass != 'string') {
				return printError("Invalid email and/or password.", Number('1.' + __line), IP, 1048575);
			}
			
			if(((data.email).indexOf("@") != -1) && ((data.email).indexOf(".") != -1)) {
				bcrypt.genSalt(10, function(err, salt) {
					if(err) {
						return printError(err, Number('2.' + __line), IP);
					}
					
					// Hash password
					bcrypt.hash(data.pass, salt, function(err, hash) { 
						if(err) {
							return printError(err, Number('3.' + __line), IP);
						}
						
						fs.readdir("../users", function(err, li) {
							if(err) {
								return printError(err, Number('4.' + __line), IP);
							}
							
							// Search the database to check if the user already exists
							li.forEach(function(file) {
								if(file != 'user.txt') {
									var dat = fs.readFileSync("../users/" + file, 'utf8');
									values = dat.split("\n");
									if(values[0].trim() == data.email) {
										printError("An account with this email has already been registered...", Number('5.' + __line), IP);
										return escapeAll = true;
									}
								}
							});
							
							if(escapeAll) {
								escapeAll = false;
								return;
							}
							
							// User doesn't exist yet, register new user
							fs.readFile("../users/user.txt", 'utf8', function(error, dat) {
								if(error) {
									return printError(error, Number('6.' + __line), IP);
								}
								
								values = dat.split("\n");
								
								// Add email & password to user file
								fs.writeFile("../users/" + values[0].trim() + ".txt", data.email + "\n" + hash, function(err, data) {
									if(err) {
										return printError(err, Number('7.' + __line), IP);
									}
									
									// Make sure next user registered doesn't get the same user id
									fs.writeFile("../users/user.txt", Number(values[0]) + 1, function(err, data) {
										if(err) {
											return printError(err, Number('8.' + __line), IP);
										}
										
										printSuccess(IP);
									});
								});
							});
						});
					});
				});
			} else {
				printError("This is impossible unless you hacked :/", Number('9.' + __line), IP, 1048575);
			}
		});
	});
});
