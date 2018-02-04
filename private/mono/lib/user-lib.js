var fs = require('fs');
var path = require('path');
var mkdir = require('mkdirp');
var file_helper = require('./file-lib.js');

//////////////// 'user-id/user.txt' file structure ////////////////
//                                                               //
//  LINE 0: Email                                                //
//  LINE 1: Hashed password                                      //
//  LINE 2: Session                                              //
//                                                               //
///////////////////////////////////////////////////////////////////

function rmdirAsync(path, callback) {
	fs.readdir(path, function(err, files) {
		if(err) {
			callback(err, []);
			return;
		}
		var wait = files.length,
			count = 0,
			folderDone = function(err) {
			count++;
			if( count >= wait || err) {
				fs.rmdir(path,callback);
			}
		};
		if(!wait) {
			folderDone();
			return;
		}
		
		path = path.replace(/\/+$/,"");
		files.forEach(function(file) {
			var curPath = path + "/" + file;
			fs.lstat(curPath, function(err, stats) {
				if(err) {
					callback(err, []);
					return;
				}
				if(stats.isDirectory()) {
					rmdirAsync(curPath, folderDone);
				} else {
					fs.unlink(curPath, folderDone);
				}
			});
		});
	});
};

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

exports.get = function(id, callback) {
	fs.readFile(path.join(__dirname, '../users/', id.toString(), '/user.txt'), 'utf8', function(err, data) {
		if(err) {
			return callback({"error": err, "line": __line});
		}
		
		var dat = data.split("\n");
		var session = dat[2].trim();
		
		if(Math.round((new Date()).getTime() / 60000) > Number(session.substring(session.indexOf("_") + 1, session.length))) {
			exports.changeProp(usr, 2, "SESSION EXPIRED", function(err) {
				if(err) {
					return callback({"error": err, "line": __line});
				}
				
				callback({"error": err.error, "line": __line + "." + err.line}, dat);
			});
		} else {
			callback(err, dat);
		}
	});
}

exports.find = function(info, callback) {
	fs.readFile(path.join(__dirname, '../users/ips.txt'), 'utf8', function(err, data) {
		var email = info.email;
		
		if(info.IP) {
			var IP = info.IP;
			var ips = data.split("\n");
			
			for(var ip = 0; ip < ips.length; ip++) {
				if(IP == ips[ip].trim()) {
					return callback(err, true);
				}
			}
		}
		
		fs.readdir(path.join(__dirname, '../users'), function(err, files) {
			if(err) {
				return callback({"error": err, "line": __line});
			}
			
			var email_found = false;
			var files_processed = 0;
			
			for(i = 0; i < files.length; i++) {
				(function(file) {
					if(file == "user.txt" || file == "ips.txt") {
						files_processed++;
						
						if(!email_found && files_processed == files.length) {
							callback(err, false);
						}
					} else {
						fs.readFile(path.join(__dirname, '../users/', file, '/user.txt'), 'utf8', function(err, data) {
							if(err) {
								return callback({"error": err, "line": __line});
							}
							
							var content = data.split("\n");
							
							if(content[0].trim() == email) {
								email_found = true;
								callback(err, true, {"content": content, "usr": file});
							}
							
							files_processed++;
							
							if(!email_found && files_processed == files.length) {
								callback(err, false);
							}
						});
					}
				})(files[i]);
				
				if(email_found) {
					break;
				}
			}
		});
	});
}

exports.findSession = function(session, callback) { // Currently unused; should it be removed?
	fs.readdir(path.join(__dirname, '../users'), function(err, files) {
		if(err) {
			return callback({"error": err, "line": __line});
		}
		
		var session_found = false;
		var files_processed = 0;
		
		for(i = 0; i < files.length; i++) {
			(function(file) {
				if(file == "user.txt" || file == "ips.txt") {
					files_processed++;
					
					if(files_processed == files.length) {
						callback(err, false);
					}
				} else {
					fs.readFile(path.join(__dirname, '../users/', file, '/user.txt'), 'utf8', function(err, data) {
						if(err) {
							return callback({"error": err, "line": __line});
						}
						
						var content = data.split("\n");
						
						if(content[2].trim() == email) {
							session_found = true;
							callback(err, true, file);
						}
						
						files_processed++;
						
						if(files_processed == files.length) {
							callback(err, false);
						}
					});
				}
			})(files[i]);
			
			if(session_found) {
				break;
			}
		}
	});
}

exports.getTotal = function(callback) {
	fs.readFile(path.join(__dirname, "../users/user.txt"), 'utf8', function(err, data) {
		if(err) {
			return callback({"error": err, "line": __line});
		}
		
		callback(err, Number(data.trim()));
	});
}

exports.add = function(data, callback) {
	if(typeof data.user === 'undefined') {
		exports.getTotal(function(err, usr) {
			if(err) {
				return callback({"error": err, "line": __line});
			}
			
			createUser(usr, data.email, data.hash, data.IP, function(err) {
				if(err) {
					return callback({"error": err, "line": __line});
				}
				
				callback(err, usr + 1);
			});
		});
	} else {
		createUser(data.user, data.email, data.hash, data.IP, function(err) {
			if(err) {
				return callback({"error": err, "line": __line});
			}
			
			callback(err, data.user + 1);
		});
	}
}

function createUser(usr, email, hash, IP, callback) {
	var user = usr.toString();
	
	mkdir(path.join(__dirname, '../users/', user), function(err) {
		if(err) {
			return callback({"error": err, "line": __line});
		}
		
		// Add email & hash to user file
		fs.writeFile(path.join(__dirname, "../users/", user, "/user.txt"), email + "\n" + hash, function(err, data) {
			if(err) {
				return callback({"error": err, "line": __line});
			}
			
			// Make sure next user registered doesn't get the same user id
			fs.writeFile(path.join(__dirname, "../users/user.txt"), usr + 1, function(err, data) {
				if(err) {
					return callback({"error": err, "line": __line});
				}
				
				// Register IP
				registerIP(IP, function(err) {
					if(err) {
						return callback({"error": err.error, "line": __line + "." + err.line});
					}
					
					callback();
				});
			});
		});
	});
}

function registerIP(IP, callback) {
	file_helper.addLine(path.join(__dirname, '../users/ips.txt'), IP, function(err) {
		if(err) {
			return callback({"error": err.error, "line": __line + "." + err.line});
		}
		
		callback();
	});
}

exports.changeProp = function(usr, prop, val, callback) {
    var usrpath = path.join(__dirname, "../users/", usr.toString(), "/user.txt");
	
	file_helper.editLine(usrpath, val, function(err) {
		if(err) {
			return callback({"error": err.error, "line": __line + "." + err.line});
		}
		
		callback();
	});
}

exports.delOld = function(callback) {
	fs.readdir(path.join(__dirname, '../users'), function(err, files) {
		if(err) {
			return callback({"error": err, "line": __line});
		}
		
		var deadUsr_found = false;
		var files_processed = 0;
		
		for(i = 0; i < files.length; i++) {
			(function(file) {
				if(file == "user.txt" || file == "ips.txt") {
					files_processed++;
					
					if(files_processed == files.length) {
						callback(err, false);
					}
				} else {
					fs.readFile(path.join(__dirname, '../users/', file, '/server/.properties'), 'utf8', function(err, data) {
						if(err) {
							return callback({"error": err, "line": __line});
						}
						
						var content = data.split("\n");
						var today = new Date();
						
						if(today.getTime() - content[3].trim() > 8589934591) { // '.properties' structure is in 'server-handler.js'
							deadUsr_found = true;
							
							rmdirAsync(path.join(__dirname, '../users/', file), function(err) {
								if(err) {
									return callback({"error": err, "line": __line});
								}
								
								return callback(err, true, file);
							});
						}
						
						files_processed++;
						
						if(files_processed == files.length) {
							callback(err, false);
						}
					});
				}
			})(files[i]);
			
			if(deadUsr_found) {
				break;
			}
		}
	});
}
