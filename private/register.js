var path = require('path');
var mods = require('./getProps.js');
var express = mods.express;
var app = mods.app;
var http = mods.http;
var io = mods.io;
var fs = require('fs');
var bcrypt = require('bcryptjs');

var values = mods.values;
var props = mods.props;
var escapeAll = false;

function printError(reason, id) {
	io.emit('reg-complete', {"success": false, "reason": reason, "id": id});
}

function printData(data) {
	io.emit('reg-status', data);
}

io.on('connection', function(socket){
	socket.on('register', function(data){
		if(typeof data.email != 'string' || typeof data.pass != 'string') {
			return printError("Invalid email and/or password.", 0);
		}
		
		if(((data.email).indexOf("@") != -1) && ((data.email).indexOf(".") != -1)) {
			bcrypt.genSalt(10, function(err, salt) {
				if(err) {
					return printError(err, 1);
				}
				
				bcrypt.hash(data.pass, salt, function(err, hash) { 
					if(err) {
						return printError(err, 2);
					}
					
					fs.readdir("users", function(err, li) {
						if(err) {
							return printError(err, 3);
						}
						
						var files = 0;
						var currentFile = 0;
						li.forEach(function(file) {
							files += 1;
						});
						
						if(files > 0) {
							li.forEach(function(file) {
								var dat = fs.readFileSync("users/" + file, 'utf8');
								values = dat.split("\n");
								if(values[0].trim() == data.email) {
									printError("An account with this email has already been registered...", 4);
									return escapeAll = true;
								}
								
								currentFile += 1;
								printData(((currentFile/files)*100).toFixed(2) + "%" + "\r");
							});
						}
						
						if(escapeAll) {
							escapeAll = false;
							return;
						}
						
						fs.readFile("users/user.txt", 'utf8', function(error, dat) {
							if(error) {
								return printError(error, 5);
							}
							
							values = dat.split("\n");
							fs.writeFile("users/" + values[0].toString() + ".txt", data.email + "\n" + hash, function(err, data) {
								if(err) {
									return printError(err, 6);
								}
								
								fs.writeFile("users/user.txt", Number(values[0]) + 1, function(err, data) {
									if(err) {
										return printError(err, 7);
									}
									
									io.emit('reg-complete', {"success": true});
								});
							});
						});
					});
				});
			});
		} else {
			printError("This is impossible unless you hacked :/", 8);
		}
	});
});
