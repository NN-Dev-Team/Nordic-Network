var path = require('path');
var user = require('./user-extras.js');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var bcrypt = require('bcryptjs');
var toobusy = require('toobusy-js');
var randomstring = require('randomstring');

var values = [];
var props = [];
var valid = false;

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
    res.sendFile(path.join(__dirname + '/test-client-login.html'));
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

function printError(reason, id, IP, time) {
	io.emit('login-complete', {"success": false, "reason": reason, "id": id});
	
	if(typeof IP == 'string') {
		if(typeof time != 'number') {
			time = 1023;
		}
		
		user.addLine("../bans.txt", IP + " " + ((new Date()).getTime() + time), function(err, data) {
			if(err) {
				console.log(err);
			}
		});
	}
}

function printSuccess(IP, id, time) {
	if(typeof id == 'number') {
		io.emit('login-complete', {"success": true, "id": id});
	} else {
		io.emit('login-complete', {"success": true});
	}
	
	if(typeof IP == 'string') {
		if(typeof time != 'number') {
			time = 1023;
		}
		
		user.addLine("../bans.txt", IP + " " + ((new Date()).getTime() + time), function(err, data) {
			if(err) {
				console.log(err);
			}
		});
	}
}

io.on('connection', function(socket){
	var IP = socket.request.connection.remoteAddress;
	socket.on('login', function(data){
		if(typeof data.email != 'string' || typeof data.pass != 'string') {
			return printError("Invalid email and/or password.", 0, IP, 131071);
		}
		
		if(((data.email).indexOf("@") != -1) && ((data.email).indexOf(".") != -1)) {
			fs.readdir("../users", function(err, li) {
				if(err) {
					return printError(err, 2, IP);
				}
				
				var files = 0;
				var currentFile = 0;
				li.forEach(function(file) {
					files += 1;
				});
				
				if(files > 0) {
					li.forEach(function(file) {
						if(file != 'user.txt') {
							var dat = fs.readFileSync("../users/" + file, 'utf8');
							var currentFile = file.substring(0, file.length - 4);
							var esc = false;
							values = dat.split("\n");
							if(values[0].trim() == data.email) {
								dat = bcrypt.compareSync(data.pass, values[1].toString());
								if(dat) {
									var userSession = randomstring.generate(16);
									userSession += Math.round(((new Date()).getTime() / 60000) + 60*24);
									data = fs.readFileSync("../servers/" + currentFile + "/.properities", 'utf8');
									values = data.split("\n");
									values[0] = userSession;
									
									fs.writeFileSync("../servers/" + currentFile + "/.properities", values.join("\n"));
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
				}
				
				if(!valid) {
					return printError("Incorrect email and/or password", 3, IP, 2048);
				}
			});
		} else {
			printError("Invalid email.", 4, IP, 131071);
		}
	});
});
