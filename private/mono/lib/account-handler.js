var bcrypt = require('bcryptjs');
var randomstring = require('randomstring');
var user = require('./user-lib.js');

////////////////////////////////    REGISTRATION    ////////////////////////////////

exports.register = function regUsr(data, IP, callback) {
	if (typeof data.email != 'string' || typeof data.pass != 'string') {
        return console.log("[!] Possible hacker detected (with IP: " + IP + ")");
    } else if (((data.email).indexOf("@") != -1) && ((data.email).indexOf(".") != -1)) {
        bcrypt.genSalt(10, function(err, salt) {
            if (err) {
                return callback({"error": err, "id": 1, "line": __line});
            }

            // Hash password
            bcrypt.hash(data.pass, salt, function(err, hash) {
                if (err) {
                    return callback({"error": err, "id": 2, "line": __line});
                }

                // Search the database to check if the user already exists
                user.find(data.email, function(err, line, found, dat, last, usr) {
                    if (err) {
                        return callback({"error": err, "id": 3, "line": __line});
                    }

                    if (found) {
						return callback({"error": "USER_ALREADY_EXISTS", "id": 4, "line": __line});
                    }

                    // User doesn't exist yet, check if enough disk space is available
                    diskspace.check('/', function(err, total, free) {
                        if (free < 2147483648) {
                            user.delOld(function(err, line, success) {
                                if (err) {
                                    return callback({"error": err, "id": 5, "line": __line});
                                }

                                if (success) {
                                    user.add(usr, data.email, hash, function(err, line) {
                                        if (err) {
                                            return callback({"error": err, "id": 6, "line": __line});
                                        }

                                        callback(err, usr);
                                    });
                                } else {
                                    return callback({"error": "NOT_ENOUGH_DISKSPACE", "id": 7, "line": __line});
                                }
                            });
                        } else {

                            // Enough disk space available, register user
                            user.add(usr, data.email, hash, function(err, line) {
                                if (err) {
                                    return callback({"error": err, "id": 8, "line": __line + '.' + line});
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

exports.login = function login(data, IP, callback) {
	if(typeof data.email != 'string' || typeof data.pass != 'string') {
		return console.log("[!] Possible hacker detected (with IP: " + IP + ")");
	} else if(((data.email).indexOf("@") != -1) && ((data.email).indexOf(".") != -1)) {
		user.find(data.email, function(err, line, found, dat, usr) {
			if(err) {
				return callback({"error": err, "id": 1, "line": __line + '.' + line});
			}
			
			if(found) {
				bcrypt.compare(data.pass, dat[1].trim(), function(err, valid) {
					if(err) {
						return callback({"error": err, "id": 2, "line": __line});
					}
					
					if(valid) {
						var userSession = randomstring.generate(16);
						userSession += Math.round(((new Date()).getTime() / 60000) + 60*24);
						dat[2] = userSession;
						
						fs.writeFile("users/" + usr + "/user.txt", dat.join("\n"), function(err, data) {
							if(err) {
								return callback({"error": err, "id": 3, "line": __line});
							}
							
							callback(err, usr, userSession);
						});
					} else {
						return callback({"error": "INCORRECT_LOGIN_DETAILS", "id": 4, "line": __line});
					}
				});
			} else {
				return callback({"error": "INCORRECT_LOGIN_DETAILS", "id": 4, "line": __line});
			}
		});
	} else {
		return console.log("[!] Possible hacker detected (with IP: " + IP + ")");
	}
}

////////////////////////////////    LOGOUT    ////////////////////////////////

exports.logout = function forgetSession(data, callback) {
	user.get(data.id, function(err, line, dat) {
		if(err) {
			return callback({"error": err, "id": 1, "line": __line + '.' + line});
		}
        
        if(dat[2].trim() == data.session && dat[2].trim() != "SESSION EXPIRED") {
            user.changeProp(data.id, 2, "SESSION EXPIRED", function(err, line) {
                if(err) {
					return callback({"error": err, "id": 2, "line": __line});
                }
                
                sendToClient('logout-complete');
            });
        }
	});
}