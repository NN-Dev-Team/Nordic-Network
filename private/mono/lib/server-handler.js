var mkdir = require('mkdirp');
var user = require('./user-lib.js');

exports.create = function createServer(data, IP, callback) {
	if(typeof data.session != 'string' || (data.session).length < 24) {
		return console.log("[!] Possible hacker detected (with IP: " + IP + ")");
	} else if(Math.round((new Date).getTime() / 60000 > (data.session).substring(16))) {
		return sendToClient('creation-complete', "Session has expired.", '15.' + __line);
	} else if(data.type < 0 || data.type > 2) {
		return sendToClient('creation-complete', "Invalid server type.", '16.' + __line);
	} else if(typeof data.id == 'number') {
		
		// User id specified, get user session
		user.get(data.id, function(err, line, dat) {
			if(err) {
				return sendToClient('creation-complete', err, '17.' + __line + '.' + line);
			}
			
			// Check if session is valid
			if(dat[2].trim() == data.session && dat[2].trim() != "SESSION EXPIRED") {
				
				// Session valid, create server
				mkdir("users/" + data.id + "/server", function(err) {
					if(err) {
						return sendToClient('creation-complete', err, '18.' + __line);
					}
					
					fs.writeFile("users/" + data.id + "/server/.properities", "0\n" + data.type + "\n0\n0", function(err, dat) {
						if(err) {
							return sendToClient('creation-complete', err, '19.' + __line);
						}
						
						if(data.type == 0) {
							mcLib.addJar("servers/" + data.id, function(err) {
								if(err) {
									return sendToClient('creation-complete', err, '20.' + __line);
								}
								
								sendToClient('creation-complete');
							});
						}
					});
				});
			} else {
				sendToClient('creation-complete', "Invalid session.", '21.' + __line);
			}
		});
	} else {
		return console.log("[!] Possible hacker detected (with IP: " + IP + ")");
	}
}