var path = require('path');
var mods = require('./getProps.js');
var fsExt = require('./fsPlus.js');
var express = mods.express;
var app = mods.app;
var http = mods.http;
var io = mods.io;
var fs = require('fs');
var bcrypt = require('bcryptjs');

var values = mods.values;
var props = mods.props;
var escapeAll = false;

function printError(reason, id, time, IP) {
	io.emit('reg-complete', {"success": false, "reason": reason, "id": id});
	
	if(typeof IP == 'string') {
		if(typeof time != 'number') {
			time = 1024;
		}
		
		var result = fsExt.addLine("bans.txt", IP + " " + ((new Date()).getTime + time));
		if(result) {
			console.log(result);
		}
	}
}

function printSuccess(IP, time) {
	io.emit('reg-complete', {"success": true});
	
	if(typeof IP == 'string') {
		if(typeof time != 'number') {
			time = 1024;
		}
		
		var result = fsExt.addLine("bans.txt", IP + " " + ((new Date()).getTime + time));
		if(result) {
			console.log(result);
		}
	}
}

/* function printData(data) {
	io.emit('reg-status', data);
} */

io.on('connection', function(socket){
	var IP = socket.request.connection.remoteAddress;
	socket.on('register', function(data){
		if(typeof data.email != 'string' || typeof data.pass != 'string') {
			return printError("Invalid email and/or password.", 0, IP, 1048575);
		}
		
		if(((data.email).indexOf("@") != -1) && ((data.email).indexOf(".") != -1)) {
			bcrypt.genSalt(10, function(err, salt) {
				if(err) {
					return printError(err, 1, IP);
				}
				
				// Hash password
				bcrypt.hash(data.pass, salt, function(err, hash) { 
					if(err) {
						return printError(err, 2, IP);
					}
					
					fs.readdir("users", function(err, li) {
						if(err) {
							return printError(err, 3, IP);
						}
						
						var files = 0;
						var currentFile = 0;
						
						// Count files
						li.forEach(function(file) {
							files += 1;
						});
						
						if(files > 0) {
							
							// Directory isn't empty, search the database to check if the user already exists
							li.forEach(function(file) {
								var dat = fs.readFileSync("users/" + file, 'utf8');
								values = dat.split("\n");
								if(values[0].trim() == data.email) {
									printError("An account with this email has already been registered...", 4);
									return escapeAll = true;
								}
								
								/* currentFile += 1;
								printData(((currentFile/files)*100).toFixed(2) + "%" + "\r"); */
							});
						}
						
						if(escapeAll) {
							escapeAll = false;
							return;
						}
						
						// User doesn't exist yet, register new user
						fs.readFile("users/user.txt", 'utf8', function(error, dat) {
							if(error) {
								return printError(error, 5, IP);
							}
							
							values = dat.split("\n");
							
							// Add email & password to user file
							fs.writeFile("users/" + values[0].toString() + ".txt", data.email + "\n" + hash, function(err, data) {
								if(err) {
									return printError(err, 6, IP);
								}
								
								// Make sure next user registered doesn't get the same user id
								fs.writeFile("users/user.txt", Number(values[0]) + 1, function(err, data) {
									if(err) {
										return printError(err, 7, IP);
									}
									
									io.emit('reg-complete', {"success": true});
								});
							});
						});
					});
				});
			});
		} else {
			printError("This is impossible unless you hacked :/", 8, IP, 1048575);
		}
	});
});
