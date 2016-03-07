var mods = require('./getProps.js');
var express = mods.express;
var app = mods.app;
var http = mods.http;
var io = mods.io;
var fs = require('fs');
var mkdir = require('mkdirp');

function addLine(dir, item) {
	var fileRes = fs.readFile(dir, 'utf8', function(err, data) {
		if(err) {
			return err;
		}
		
		var items = data.split("\n");
		items.push(item);
		items = items.join("\n");
		var fileRes2 = fs.writeFile(dir, items, function(err, data) {
			if(err) {
				return err;
			}
		});
		
		if(fileRes2) {
			return fileRes2;
		}
	});
	
	if(fileRes) {
		return fileRes;
	}
}

function printError(reason, id, time, IP) {
	io.emit('creation-complete', {"success": false, "reason": reason, "id": id});
	if(typeof time == 'number' && typeof IP == 'string') {
		var result = addLine("bans.txt", IP + " " + ((new Date()).getTime + time));
		if(result) {
			console.log(result);
		}
	}
}

function printSuccess(id) {
	if(typeof id == 'number') {
		io.emit('creation-complete', {"success": true, "id": id});
	} else {
		io.emit('creation-complete', {"success": true});
	}
}

function fileContains(file, item) {
	fs.readFile(file, 'utf8', function(err, data) {
		callback(err, ~data.indexOf(item));
	});
}

io.on('connection', function(socket){
	var IP = socket.request.connection.remoteAddress;
	socket.on('create-serv', function(data){
		fileContains("bans.txt", IP, function(err, info) {
			if(err) {
				return console.log(err);
			}
			
			if(info) {
				return printError("Please don't overload our servers.", 0);
			} else if(typeof data.session != 'string' || (data.session).length < 24) {
				return printError("Invalid session ID.", 1, 1048575, IP);
			} else if(Math.round((new Date).getTime() / 60000 > (data.session).substring(16))) {
				return printError("Session has expired.", 2, 65535, IP);
			} else if(data.type < 0 || data.type > 2) {
				return printError("Invalid server type.", 3, 131071, IP);
			}
			
			if(typeof data.id == 'number') {
				fs.readFile("users/" + data.id + ".txt", 'utf8', function(err, dat) {
					if(err) {
						return printError(err, 4, 65535, IP);
					}
					
					var values = dat.split("\n");
					if(values[1].toString == data.session) {
						mkdir("servers/" + data.id, function(err) {
							if(err) {
								return printError(err, 5);
							}
							
							fs.writeFile("servers/" + data.id + "/.properities", data.session + "\n0\n" + data.type + "\n0\n0", function(err, data) {
								if(err) {
									return printError(err, 6, 65535, IP);
								}
								
								printSuccess();
							});
						});
					} else {
						printError("Unknown session.", 7, 524287, IP);
					}
				});
			} else {
				fs.readdir("users", function(err, li) {
					if(err) {
						return printError(err, 8);
					}
					
					var currentFile = 0;
					
					li.forEach(function(file) {
						var dat = fs.readFileSync("users/" + file, 'utf8');
						var values = dat.split("\n");
						if(values[1].toString() == data.session) {
							mkdir("servers/" + currentFile, function(err) {
								if(err) {
									return printError(err, 9);
								}
								
								fs.writeFile("servers/" + currentFile + "/.properities", data.session + "\n0\n" + data.type + "\n0\n0", function(err, data) {
									if(err) {
										return printError(err, 10);
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
					printError("Unknown session.", 11, 524287, IP);
				}
			}
		});
	});
});