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
	
	if(typeof IP == 'string') {
		if(typeof time != 'number') {
			time = 1023;
		}
		
		var result = fsExt.addLine("bans.txt", IP + " " + ((new Date()).getTime + time));
		if(result) {
			console.log(result);
		}
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
		
		var result = fsExt.addLine("bans.txt", IP + " " + ((new Date()).getTime + time));
		if(result) {
			console.log(result);
		}
	}
}

io.on('connection', function(socket){
	socket.on('login', function(data){
		if(typeof data.email != 'string' || typeof data.pass != 'string') {
			return printError("Invalid email and/or password.", 0);
		}
		
		if(((data.email).indexOf("@") != -1) && ((data.email).indexOf(".") != -1)) {
			fs.readdir("users", function(err, li) {
				if(err) {
					return printError(err, 2);
				}
				
				li.forEach(function(file) {
					if(file != 'user.txt') {
						var dat = fs.readFileSync("users/" + file, 'utf8');
						var currentFile = file.substring(0, file.length - 5);
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
					return printError("Incorrect email and/or password", 3);
				}
			});
		} else {
			printError("Invalid email.", 4);
		}
	});
});
