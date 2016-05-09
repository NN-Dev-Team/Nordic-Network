var fs = require('fs');

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
			return callback(err);
		}
		
		callback(err, data.split("\n"));
	});
}

exports.find = function findEmailMatch(email, callback) {
	fs.readFile('users/user.txt', 'utf8', function(err, data) {
		if(err) {
			return callback(err);
		}
		
		for(i = 0; i < Number(data.trim()); i++) {
			getUserData(i, function(err, data) {
				if(err) {
					return callback(err);
				}
				
				if(data[0].trim() == email) {
					callback(err, true, data);
				}
			});
		}
		
		callback(err, false, data);
	});
}