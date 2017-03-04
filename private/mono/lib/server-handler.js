var mkdir = require('mkdirp');
var user = require('./user-lib.js');

//////////////// 'server/.properties' file structure ////////////////
//                                                                 //
//  LINE 0: Sleep state; boolean                                   //
//  LINE 1: Type; number                                           //
//  LINE 2: Rank; number                                           //
//  LINE 3: Last time server was online; number (ms since 1970)    //
//                                                                 //
/////////////////////////////////////////////////////////////////////

function boolify(obj, ignoreCase) {
	if(ignoreCase) {
		str = str.toLowerCase();
	}
	
	if(obj == 'true' || obj == 1 || obj == '1') {
		return true;
	} else {
		return false;
	}
}

////////////////////////////////    SERVER CREATION    ////////////////////////////////

exports.create = function createServer(data, IP, callback) {
	if(typeof data.session != 'string' || (data.session).length < 24) {
		return console.log("[!] Possible hacker detected (with IP: " + IP + ")");
	} else if(Math.round((new Date).getTime() / 60000 > (data.session).substring(16))) {
		return callback({"error": "SESSION_EXPIRED", "id": 1, "line": __line});
	} else if(data.type < 0 || data.type > 2) {
		return callback({"error": "INVALID_SERV_TYPE", "id": 2, "line": __line});
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
					
					fs.writeFile("users/" + data.id + "/server/.properties", "0\n" + data.type + "\n0\n0", {mode: 0o600}, function(err, dat) {
						if(err) {
							return callback({"error": err, "id": 5, "line": __line});
						}
						
						if(data.type == 0) {
							mcLib.addJar("users/" + data.id + "/server", function(err) {
								if(err) {
									return callback({"error": err, "id": 6, "line": __line});
								}
								
								callback();
							});
						}
					});
				});
			} else {
				return callback({"error": "INVALID_SESSION", "id": 7, "line": __line});
			}
		});
	} else {
		return console.log("[!] Possible hacker detected (with IP: " + IP + ")");
	}
}

////////////////////////////////    STARTING SERVER    ////////////////////////////////

exports.start = function startServer(data, IP, callback) {
	if(typeof data.server != 'number' || typeof data.session != 'string') {
		return console.log("[!] Possible hacker detected (with IP: " + IP + ")");
	}
	
	fs.readFile('users/' + data.server + '/server/.properties', 'utf8', function(err, dat) {
		if (err) {
			return callback({"error": err, "id": 1, "line": __line});
		}
		
		props = dat.split("\n");
		var serv_isSleeping = boolify(props[0].trim());
		var serv_type = props[1].trim();
		var serv_rank = props[2].trim();
		var serv_ram = [256, 512, 1024, 2048, 4096];
		
		fs.readFile('users/' + data.server + "/user.txt", 'utf8', function(err, dat) {
			props = dat.split("\n");
			var user_session = props[2].trim();
			
			if(serv_isSleeping) {
				// Stop sleeping process; stop sleep-mode jar
				// WIP
			}
			
			// Check if session is matching
			if(user_session == data.session && user_session != "SESSION EXPIRED") {
				
				// Run server
				if(serv_type == 0) {
					// Minecraft PC
					
					exec("java -Xmx" + serv_ram[serv_rank] + "M -Xms" + serv_ram[serv_rank] + "M -jar users/" + data.server + "/server/minecraft_server.jar nogui", function(err2, out, stderr) {
						if(err2) {
							return callback({"error": stderr, "id": 2, "line": __line});
						}
						
						callback(err2, serv_type);
					});
				} else if(serv_type == 1) {
					// Minecraft PE
					
					callback({"error": "FEATURE_WIP_OR_DELETED", "id": 3, "line": __line});
				} else {
					// Minecraft Win 10
					
					callback({"error": "FEATURE_WIP_OR_DELETED", "id": 4, "line": __line});
				}
			} else {
				return callback({"error": "INVALID_SESSION", "id": 5, "line": __line});
			}
		});
	});
}

////////////////////////////////    STOPPING SERVER    ////////////////////////////////

exports.stop = function stopServer(data, IP, callback) {
	
}