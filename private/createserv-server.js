var mods = require('./getProps.js');
var fsExt = require('./fsPlus.js');
var express = mods.express;
var app = mods.app;
var http = mods.http;
var io = mods.io;
var fs = require('fs');
var mkdir = require('mkdirp');

function printError(reason, id, IP, time) {
	io.emit('creation-complete', {"success": false, "reason": reason, "id": id});
	
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

function printSuccess(id, IP, time) {
	if(typeof id == 'number') {
		io.emit('creation-complete', {"success": true, "id": id});
	} else {
		io.emit('creation-complete', {"success": true});
	}
	
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

io.on('connection', function(socket){
	var IP = socket.request.connection.remoteAddress;
	socket.on('create-serv', function(data){
		fsExt.fileContains("bans.txt", IP, function(err, info) {
			if(err) {
				return console.log(err);
			}
			
			if(info) {
				return printError("Please don't overload our servers.", 0);
			} else if(typeof data.session != 'string' || (data.session).length < 24) {
				return printError("Invalid session ID.", 1, IP, 131071);
			} else if(Math.round((new Date).getTime() / 60000 > (data.session).substring(16))) {
				return printError("Session has expired.", 2, IP, 524287);
			} else if(data.type < 0 || data.type > 2) {
				return printError("Invalid server type.", 3, IP, 65535);
			}
			
			// Check if user id was specified
			if(typeof data.id == 'number') {
				
				// User id specified, get user session
				fs.readFile("users/" + data.id + ".txt", 'utf8', function(err, dat) {
					if(err) {
						return printError(err, 4, IP, 131071);
					}
					
					var values = dat.split("\n");
					
					// Check if session is valid
					if(values[1].toString == data.session) {
						
						// Session valid, create server
						mkdir("servers/" + data.id, function(err) {
							if(err) {
								return printError(err, 5, IP);
							}
							
							fs.writeFile("servers/" + data.id + "/.properities", data.session + "\n0\n" + data.type + "\n0\n0", function(err, data) {
								if(err) {
									return printError(err, 6, IP);
								}
								
								printSuccess();
							});
						});
					} else {
						printError("Unknown session.", 7, IP, 262143);
					}
				});
			} else {
				
				// User id not specified, look through every user file for a matching session
				fs.readdir("users", function(err, li) {
					if(err) {
						return printError(err, 8, IP);
					}
					
					var currentFile = 0;
					
					li.forEach(function(file) {
						var dat = fs.readFileSync("users/" + file, 'utf8');
						var values = dat.split("\n");
						if(values[1].toString() == data.session) {
							
							// Session valid, create server
							mkdir("servers/" + currentFile, function(err) {
								if(err) {
									return printError(err, 9, IP);
								}
								
								fs.writeFile("servers/" + currentFile + "/.properities", data.session + "\n0\n" + data.type + "\n0\n0", function(err, data) {
									if(err) {
										return printError(err, 10, IP);
									}
									
									printSuccess(currentFile);
									return doneSearching = true;
								});
							});
						}
				
						if(doneSearching) {
							return;
						}
						
						currentFile += 1;
					});
					
					if(doneSearching) {
						return;
					}
				});
				
				if(doneSearching) {
					doneSearching = false;
				} else {
					printError("Unknown session.", 11, IP, 262143);
				}
			}
		});
	});
});