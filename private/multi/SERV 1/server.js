var toobusy = require('toobusy-js');
var user = require('./user-lib.js');
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

var values = [];
var props = [];
var valid = false;
var doneSearching = false;
var IP = '';

fs.readFile('properities.txt', 'utf8', function (err, data) {
	if (err) {
		return console.log(err);
	}
	
	values = data.split("\n");
	IP = values[0];
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

io.on('connection', function(socket){
/*	var _IP = socket.request.connection.remoteAddress;
	if(_IP == IP) { */
		
		// REGISTRATION
		socket.on('find-user', function(data){
			
			// Look for existing user
			user.find(data.email, function(err, found, dat, usr) {
				if(err) {
					return io.emit('done-looking', {"err": err, "id": '0.' + __line});
				}
				// Look for available space
				// WIP
				
				// No existing user found, back to main server
				io.emit('done-looking', {"err": false, "found": found});
			});
		});
		
		// This is only sent if this server has more space left than the other server(s)
		socket.on('reg-user', function(data) {
			io.emit('done-registering', "WIP");
		});
		
		// LOGIN
		socket.on('login-user', function(data) {
			user.find(data.email, function(err, found, dat, usr) {
				if(err) {
					return io.emit('login-done', {"err": err, "id": '1.' + __line});
				}
				
				if(found) {
					
					// Check if password is correct
					bcrypt.compare(data.pass, dat[1].trim(), function(err, valid) {
						if(err) {
							return io.emit('login-done', {"err": err, "id": '2.' + __line});
						}
						
						// Password is correct, generate new session
						if(valid) {
							var userSession = randomstring.generate(16);
							userSession += Math.round(((new Date()).getTime() / 60000) + 60*24);
							dat[2] = userSession;
							
							fs.writeFile("users/" + usr + "/user.txt", dat.join("\n"), function(err, data) {
								if(err) {
									return io.emit('login-done', {"err": err, "id": '3.' + __line});
								}
								
								io.emit('login-done', {"err": false, "matching": true, "session": userSession});
							});
						} else {
							return io.emit('login-done', {"matching": false});
						}
					});
				} else {
					return io.emit('login-done', {"matching": false});
				}
			});
		});
//	}
});