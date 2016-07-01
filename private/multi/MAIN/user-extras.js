var fs = require('fs');

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

function getUsage(data, IP) {
	var values = data.split("\n");
	var pos = [0, -1];
	
	for(i = 0; i < values.length; i++) {
		pos[1] = values[i].indexOf(IP); // Positive number (including 0) if current line contains the IP
		if(~pos[1]) {
			values = values[i].split(" ");
			break;
		}
		
		pos[0] = i;
	}
	
	if(~pos[1]) {
		return [Number(values[1]), pos[0], pos[1]];
	} else {
		return [-1, -1, -1];
	}
}

exports.addIP = function logIP(IP, callback) {
	fs.readFile('bans.txt', 'utf8', function(err, data) {
		if(err) {
			return callback(err);
		}
		
		var items = data.split("\n");
		if(items.length == 1) {
			items[0] = IP + " 0";
		} else {
			items.push(IP + " 0");
		}
		items = items.join("\n");
		fs.writeFile('bans.txt', items, function(err, data) {
			if(err) {
				return callback(err);
			}
			
			callback();
		});
	});
}

exports.incrUsage = function logUsage(IP, count) {
	fs.readFile('bans.txt', 'utf8', function(err, data) {
		if(err) {
			return console.log(err);
		}
		
		var usage = getUsage(data, IP);
		if(~usage[1]) {
			var items = data.split("\n");
			var row = items[usage[1]].split(" ");
			row[1] = usage[0] + count;
			row = row.join(" ");
			items[usage[1]] = row;
			items = items.join("\n");
			fs.writeFile('bans.txt', items, function(err, data) {
				if(err) {
					return console.log(err);
				}
			});
		}
	});
}

exports.isBanned = function checkBans(IP, callback) {
	fs.readFile('bans.txt', 'utf8', function(err, data) {
		if(err) {
			return callback(err);
		}
		
		var usage = getUsage(data, IP);
		
		if(usage[0] > 16) {
			callback(err, [true, true]);
		} else {
			callback(err, [false, usage[2]]);
		}
	});
}

exports.get = function getUserData(id, callback) {
	fs.readFile('users/' + id + '/user.txt', 'utf8', function(err, data) {
		if(err) {
			return callback(err, __line);
		}
		
		callback(err, __line, data.split("\n"));
	});
}

exports.find = function findEmailMatch(email, callback) {
	fs.readdir('users', function(err, files) {
		if(err) {
			return callback(err, __line);
		}
		
		files.forEach(function(file) {
			fs.readFile(file + '/user.txt', 'utf8', function(err, data) {
				if(err) {
					return callback(err, __line);
				}
				
				if(data[0].trim() == email) {
					callback(err, __line, true, data, i, Number(data.trim()));
				}
			});
		});
		
		callback(err, __line, false, data);
	});
}

exports.findSession = function findSessionMatch(session, callback) {
	fs.readdir('users', function(err, files) {
		if(err) {
			return callback(err, __line);
		}
		
		files.forEach(function(file) {
			fs.readFile(file + '/user.txt', 'utf8', function(err, data) {
				if(err) {
					return callback(err, __line);
				}
				
				if(data[2].trim() == session) {
					callback(err, __line, true, i);
				}
			});
		});
		
		callback(err, __line, false);
	});
}

exports.getTotal = function getUserCount(callback) {
	fs.readFile("users/users.txt", 'utf8', function(err, data) {
		if(err) {
			callback(err, __line);
		}
		
		callback(Number(data.trim()));
	});
}

exports.add = function addUser(usr, email, hash, callback) {
	mkdir('users/' + usr, function(err) {
		if(err) {
			return callback(err, __line);
		}
		
		// Add email & hash to user file
		fs.writeFile("users/" + usr + "/user.txt", data.email + "\n" + hash, function(err, data) {
			if(err) {
				return callback(err, __line);
			}
			
			// Make sure next user registered doesn't get the same user id
			fs.writeFile("users/user.txt", Number(usr) + 1, function(err, data) {
				if(err) {
					return callback(err, __line);
				}
				
				exports.getTotal(function(err, line, count) {
					if(err) {
						return callback(err, __line + '.' + line);
					}
					
					fs.writeFile("users/users.txt", count + 1, function(err) {
						if(err) {
							return callback(err, __line);
						}
						
						callback();
					});
				});
			});
		});
	});
}