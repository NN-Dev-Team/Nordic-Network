var path = require('path');
var mods = require('./getProps.js');
var user = require('./user-extras.js');
var express = mods.express;
var app = mods.app;
var http = mods.http;
var io = mods.io;
var fs = require('fs');
var bcrypt = require('bcryptjs');

var values = mods.values;
var props = mods.props;
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

function printError(reason, id) {
	io.emit('reg-complete', {"success": false, "reason": reason, "id": id});
}

function printSuccess() {
	io.emit('reg-complete', {"success": true});
}

io.on('connection', function(socket){
	var IP = socket.request.connection.remoteAddress;
	socket.on('register', function(data){
		user.isBanned(IP, function(err, banned) {
			if(err) {
				return console.log(err);
			}
			
			if(banned[0]) {
				return printError("Please don't overload our servers.", Number('0.' + __line));
			} else if(banned[1] == 0) {
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
				return printError("Invalid email and/or password.", Number('1.' + __line));
			} else if(((data.email).indexOf("@") != -1) && ((data.email).indexOf(".") != -1)) {
				bcrypt.genSalt(10, function(err, salt) {
					if(err) {
						return printError(err, Number('2.' + __line));
					}
					
					// Hash password
					bcrypt.hash(data.pass, salt, function(err, hash) { 
						if(err) {
							return printError(err, Number('3.' + __line));
						}
						
						fs.readdir("users", function(err, li) {
							if(err) {
								return printError(err, Number('4.' + __line));
							}
							
							// Search the database to check if the user already exists
							li.forEach(function(file) {
								if(file != 'user.txt') {
									var dat = fs.readFileSync("users/" + file, 'utf8');
									values = dat.split("\n");
									if(values[0].trim() == data.email) {
										printError("An account with this email has already been registered...", Number('5.' + __line));
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
									return printError(error, Number('6.' + __line));
								}
								
								values = dat.split("\n");
								
								// Add email & password to user file
								fs.writeFile("users/" + values[0].trim() + ".txt", data.email + "\n" + hash, function(err, data) {
									if(err) {
										return printError(err, Number('7.' + __line));
									}
									
									// Make sure next user registered doesn't get the same user id
									fs.writeFile("users/user.txt", Number(values[0]) + 1, function(err, data) {
										if(err) {
											return printError(err, Number('8.' + __line));
										}
										
										printSuccess()
									});
								});
							});
						});
					});
				});
			} else {
				printError("This is impossible unless you hacked :/", Number('9.' + __line));
			}
		});
	});
});
