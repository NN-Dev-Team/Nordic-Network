var mkdir = require('mkdirp');
var user = require('./user-lib.js');

////////////////////////////////    SERVER CREATION    ////////////////////////////////

exports.create = function createServer(data, IP, callback) {
	if(typeof data.session != 'string' || (data.session).length < 24) {
		return console.log("[!] Possible hacker detected (with IP: " + IP + ")");
	} else if(Math.round((new Date).getTime() / 60000 > (data.session).substring(16))) {
		return callback({"error": "Session has expired.", "id": 1, "line": __line});
	} else if(data.type < 0 || data.type > 2) {
		return callback({"error": "Invalid server type.", "id": 2, "line": __line});
	} else if(typeof data.id == 'number') {
		
		// User id specified, get user session
		user.get(data.id, function(err, line, dat) {
			if(err) {
				return callback({"error": err, "id": 3, "line": __line});
			}
			
			// Check if session is valid
			if(dat[2].trim() == data.session && dat[2].trim() != "SESSION EXPIRED") {
				
				// Session valid, create server
				mkdir("users/" + data.id + "/server", function(err) {
					if(err) {
						return callback({"error": err, "id": 4, "line": __line});
					}
					
					fs.writeFile("users/" + data.id + "/server/.properties", "0\n" + data.type + "\n0\n0", function(err, dat) {
						if(err) {
							return callback({"error": err, "id": 5, "line": __line});
						}
						
						if(data.type == 0) {
							mcLib.addJar("servers/" + data.id, function(err) {
								if(err) {
									return callback({"error": err, "id": 6, "line": __line});
								}
								
								sendToClient('creation-complete');
							});
						}
					});
				});
			} else {
				return callback({"error": "Invalid session.", "id": 7, "line": __line});
			}
		});
	} else {
		return console.log("[!] Possible hacker detected (with IP: " + IP + ")");
	}
}