var fs = require('fs');
var bcrypt = require('bcryptjs');
var path = require('path');
var crypto = require('crypto');
var diskspace = require('diskspace');
var user = require('./user-lib.js');

////////////////////////////////    REGISTRATION    ////////////////////////////////

exports.register = function(data, IP, callback) {
	if (!data || typeof data.email != 'string' || typeof data.pass != 'string') {
		return console.log("[!] Possible hacker detected (with IP: " + IP + ")");
	} else if (((data.email).indexOf("@") != -1) && ((data.email).indexOf(".") != -1)) {
		bcrypt.genSalt(10, function(err, salt) {
			if(err) {
				return callback({"error": err, "id": 1, "line": __line});
			}

			// Hash password
			bcrypt.hash(data.pass, salt, function(err, hash) {
				if(err) {
					return callback({"error": err, "id": 2, "line": __line});
				}

				// Search the database to check if the user already exists
				user.find({"email": data.email, "IP": IP}, function(err, found, info) {
					if(err) {
						return callback({"error": err.error, "id": 3, "line": __line + '.' + err.line});
					}

					if(found) {
						return callback({"error": "USER_ALREADY_EXISTS", "id": 4, "line": __line});
					}

					// User doesn't exist yet, check if enough disk space is available
					diskspace.check('/', function(err, res) { // Does not work on Windows since you need to specify the 'C' drive there
						if(err) {
							return callback({"error": err, "id": 5, "line": __line});
						}
						
						if(res.free < 2147483648) {
							user.delOld(function(err, success, usr) {
								if(err) {
									return callback({"error": err.error, "id": 6, "line": __line + '.' + err.line});
								}

								if(success) {
									user.add({"user": usr, "email": data.email, "hash": hash, "IP": IP}, function(err) {
										if(err) {
											return callback({"error": err.error, "id": 7, "line": __line + '.' + err.line});
										}

										callback(err, usr);
									});
								} else {
									return callback({"error": "NOT_ENOUGH_DISKSPACE", "id": 8, "line": __line});
								}
							});
						} else {

							// Enough disk space available, register user
							user.add({"email": data.email, "hash": hash, "IP": IP}, function(err, usr) {
								if(err) {
									return callback({"error": err.error, "id": 9, "line": __line + '.' + err.line});
								}

								callback(err, usr);
							});
						}
					});
				});
			});
		});
	} else {
		return console.log("[!] Possible hacker detected (with IP: " + IP + ")");
	}
}

////////////////////////////////    LOGIN    ////////////////////////////////

exports.login = function(data, IP, callback) {
	if(!data || typeof data.email != 'string' || typeof data.pass != 'string') {
		return console.log("[!] Possible hacker detected (with IP: " + IP + ")");
	} else if(((data.email).indexOf("@") != -1) && ((data.email).indexOf(".") != -1)) {
		user.find({"email": data.email}, function(err, found, info) {
			if(err) {
				return callback({"error": err, "id": 1, "line": __line + '.' + line});
			}
			
			if(found) {
				bcrypt.compare(data.pass, info.content[1].trim(), function(err, valid) {
					if(err) {
						return callback({"error": err, "id": 2, "line": __line});
					}
					
					if(valid) {
						crypto.randomBytes(16, function(err, buf) {
							if(err) {
								return callback({"error": err, "id": 3, "line": __line});
							}
							
							var userSession = buf.toString('hex');
							userSession += "_" + Math.round(((new Date()).getTime() / 60000) + 60*24*7);
							info.content[2] = userSession;
							
							fs.writeFile(path.join(__dirname, "../users/", info.usr.toString(), "/user.txt"), info.content.join("\n"), function(err, data) {
								if(err) {
									return callback({"error": err, "id": 4, "line": __line});
								}
								
								callback(err, info.usr, userSession);
							});
						});
					} else {
						return callback({"error": "INCORRECT_LOGIN_DETAILS", "id": 5, "line": "?"}); // "line" = "?" for security reasons
					}
				});
			} else {
				return callback({"error": "INCORRECT_LOGIN_DETAILS", "id": 5, "line": "?"}); // "line" = "?" for security reasons
			}
		});
	} else {
		return console.log("[!] Possible hacker detected (with IP: " + IP + ")");
	}
}

////////////////////////////////    LOGOUT    ////////////////////////////////

exports.logout = function(data, IP, callback) {
	if(!data || typeof data.id != 'number' || typeof data.session != 'string') {
		return console.log("[!] Possible hacker detected (with IP: " + IP + ")");
	}
	
	user.get(data.id, function(err, dat) {
		if(err) {
			return callback({"error": err.error, "id": 1, "line": __line + '.' + err.line});
		}
		
		if(dat[2].trim() == data.session && dat[2].trim() != "SESSION EXPIRED") {
			user.changeProp(data.id, 2, "SESSION EXPIRED", function(err) {
				if(err) {
					return callback({"error": err.error, "id": 2, "line": __line + "." + err.line});
				}
				
				sendToClient('logout-complete');
			});
		}
	});
}