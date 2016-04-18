var path = require('path');
var mods = require('./getProps.js');
var express = mods.express;
var app = mods.app;
var http = mods.http;
var io = mods.io;
var fs = require('fs');
var bcrypt = require('bcryptjs');
var randomstring = require('randomstring');

var values = mods.values;
var props = mods.props;
var valid = false;

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
	
/*	if(typeof IP == 'string') {
		if(typeof time != 'number') {
			time = 1023;
		}
		
		fsExt.addLine("bans.txt", IP + " 1 " + ((new Date()).getTime() + time), function(err, data) {
			if(err) {
				console.log(err);
			}
		});
	} */
}

function printSuccess(IP, id, time) {
	if(typeof id == 'number') {
		io.emit('login-complete', {"success": true, "id": id});
	} else {
		io.emit('login-complete', {"success": true});
	}
	
/*	if(typeof IP == 'string') {
		if(typeof time != 'number') {
			time = 1023;
		}
		
		fsExt.addLine("bans.txt", IP + " 1 " + ((new Date()).getTime() + time), function(err, data) {
			if(err) {
				console.log(err);
			}
		});
	} */
}

io.on('connection', function(socket){
	var IP = socket.request.connection.remoteAddress;
	socket.on('login', function(data){
/*		fsExt.fileContains("bans.txt", IP + " 1", function(err, banned) {
			if(err) {
				return console.log(err);
			}
			
			if(banned) {
				return printError("Please don't overload our servers.", Number('0.' + __line));
			} else if(typeof data.email != 'string' || typeof data.pass != 'string') {
				return printError("Invalid email and/or password.", Number('1.' + __line), IP, 262143);
			} */
		
		if(((data.email).indexOf("@") != -1) && ((data.email).indexOf(".") != -1)) {
			fs.readdir("users", function(err, li) {
				if(err) {
					return printError(err, Number('2.' + __line), IP);
				}
				
				li.forEach(function(file) {
					if(file != 'user.txt') {
						var dat = fs.readFileSync("users/" + file, 'utf8');
						var currentFile = file.substring(0, file.length - 4);
						var esc = false;
						values = dat.split("\n");
						if(values[0].trim() == data.email) {
							dat = bcrypt.compareSync(data.pass, values[1].trim());
							if(dat) {
								var userSession = randomstring.generate(16);
								userSession += Math.round(((new Date()).getTime() / 60000) + 60*24);
								data = fs.readFileSync("servers/" + currentFile + "/.properities", 'utf8');
								values = data.split("\n");
								values[0] = userSession;
									
								fs.writeFileSync("servers/" + currentFile + "/.properities", values.join("\n"));
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
				
				if(!valid) {
					return printError("Incorrect email and/or password", Number('3.' + __line), IP, 2047);
				}
			});
		} else {
			printError("Invalid email.", Number('4.' + __line), 262143);
		}
	});
});
