var fs = require('fs');
var path = require('path');
var mkdir = require('mkdirp');

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

exports.get = function getUserData(id, callback) {
	fs.readFile(path.join(__dirname, '../users/', id, '/user.txt'), 'utf8', function(err, data) {
		if(err) {
			return callback(err, __line);
		}
		
		callback(err, __line, data.split("\n"));
	});
}

exports.find = function findEmailMatch(email, callback) {
	fs.readdir(path.join(__dirname, '../users'), function(err, files) {
		if(err) {
			return callback({"error": err, "line": __line});
		}
		
		var email_found = false;
		var files_processed = 0;
		
		for(i = 0; i < files.length; i++) {
			if(files[i] == "user.txt") {
				files_processed++;
			} else {
				fs.readFile(path.join(__dirname, '../users/', files[i], '/user.txt'), 'utf8', function(err, data) {
					if(err) {
						return callback({"error": err, "line": __line});
					}
					
					var content = data.split("\n");
					
					if(content[0].trim() == email) {
						callback({"error": err, "line": __line}, true, {"content": content, "usr": files[i]});
						email_found = true;
					}
					
					files_processed++;
				});
			}
			
			if(email_found) {
				files_processed = files.length;
				break;
			}
		}
		
		var i_id = setInterval(function() {
			if(files_processed == files.length) {
				if(!email_found) {
					callback({"error": err, "line": __line}, false);
				}
				
				clearInterval(i_id);
			}
		}, 0);
	});
}

exports.findSession = function findSessionMatch(session, callback) { // Currently unused; should it be removed?
	fs.readdir(path.join(__dirname, '../users'), function(err, files) {
		if(err) {
			return callback(err, __line);
		}
		
		var session_found = false;
		var files_processed = 0;
		
		for(i = 0; i < files.length; i++) {
			if(files[i] == "user.txt") {
				files_processed++;
			} else {
				fs.readFile(path.join(__dirname, '../users/', files[i], '/user.txt'), 'utf8', function(err, data) {
					if(err) {
						return callback(err, __line);
					}
					
					var content = data.split("\n");
					
					if(content[2].trim() == email) {
						callback(err, __line, true, files[i]);
						session_found = true;
					}
					
					files_processed++;
				});
			}
			
			if(session_found) {
				files_processed = files.length;
				break;
			}
		}
		
		while(files_processed < files.length);
		
		var i_id = setInterval(function() {
			if(files_processed == files.length) {
				if(!session_found) {
					callback(err, __line, false);
				}
				
				clearInterval(i_id);
			}
		}, 0);
	});
}

exports.getTotal = function getUserCount(callback) {
	fs.readFile(path.join(__dirname, "../users/user.txt"), 'utf8', function(err, data) {
		if(err) {
			return callback(err, __line);
		}
		
		callback(err, Number(data.trim()));
	});
}

exports.add = function addUser(data, callback) {
	if(typeof data.user === 'undefined') {
		getUserCount(function(err, usr) {
			if(err) {
				return callback({"error": err, "line": __line});
			}
			
			createUser(usr, data.email, data.hash, function(err) {
				if(err) {
					return callback({"error": err, "line": __line});
				}
				
				callback(err, usr + 1);
			});
		});
	} else {
		createUser(data.user, data.email, data.hash, function(err) {
			if(err) {
				return callback({"error": err, "line": __line});
			}
			
			callback(err, data.user + 1);
		});
	}
}

function createUser(usr, email, hash) {
	mkdir(path.join(__dirname, '../users/', usr), function(err) {
		if(err) {
			return callback({"error": err, "line": __line});
		}
		
		// Add email & hash to user file
		fs.writeFile(path.join(__dirname, "../users/", usr, "/user.txt"), email + "\n" + hash, function(err, data) {
			if(err) {
				return callback({"error": err, "line": __line});
			}
			
			// Make sure next user registered doesn't get the same user id
			fs.writeFile(path.join(__dirname, "../users/user.txt"), usr + 1, function(err, data) {
				if(err) {
					return callback({"error": err, "line": __line});
				}
				
				callback();
			});
		});
	});
}

// Not used anywhere atm; should we still keep it?
exports.changeProp = function editLine(usr, prop, val, callback) {
    var usrpath = path.join(__dirname, "../users/", usr, "/user.txt");
    
    fs.readFile(usrpath, 'utf8', function(err, data) {
        if(err) {
            return callback(err, __line);
        }
        
        var propValues = data.split("\n");
        propValues[prop] = val;
        var newContent = propValues.join("\n");
        
        fs.writeFile(usrpath, newContent, function(err, data) {
            if(err) {
                return callback(err, __line);
            }
            
            callback();
        });
    });
}

exports.delOld = function delOldUser(callback) {
	fs.readdir(path.join(__dirname, '../users'), function(err, files) {
		if(err) {
			return callback({"error": err, "line": __line});
		}
		
		var deadUsr_found = false;
		var files_processed = 0;
		
		for(i = 0; i < files.length; i++) {
			if(files[i] == "user.txt") {
				files_processed++;
			} else {
				fs.readFile(path.join(__dirname, '../users/', files[i], '/server/.properties'), 'utf8', function(err, data) {
					if(err) {
						return callback({"error": err, "line": __line});
					}
					
					var content = data.split("\n");
					var today = new Date();
					
					if(today.getTime() - content[3].trim() > 8589934591) { // '.properties' structure is in 'server-handler.js'
						rmdirAsync(path.join(__dirname, '../users/', files[i], '/server'), function(err) {
							if(err) {
								return callback({"error": err, "line": __line});
							}
							
							callback({"error": err, "line": __line}, true, files[i]);
							deadUsr_found = true;
						});
					}
					
					files_processed++;
				});
			}
			
			if(deadUsr_found) {
				files_processed = files.length;
				break;
			}
		}
		
		while(files_processed < files.length);
		
		var i_id = setInterval(function() {
			if(files_processed == files.length) {
				if(!deadUsr_found) {
					callback({"error": err, "line": __line}, false);
				}
				
				clearInterval(i_id);
			}
		}, 0);
	});
}
