var fs = require('fs');

//////////////// 'user-id/user.txt' file structure ////////////////
////                                                           ////
////  LINE 0: Email                                            ////
////  LINE 1: Hashed password                                  ////
////  LINE 2: Session                                          ////
////                                                           ////
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
				if( err ) {
					callback(err, []);
					return;
				}
				if( stats.isDirectory() ) {
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
		
		var email_found = false;
		var files_processed = 0;
		
		for(i = 0; i < files.length; i++) {
			if(files[i] == "user.txt") {
				files_processed++;
			} else {
				fs.readFile('users/' + files[i] + '/user.txt', 'utf8', function(err, data) {
					if(err) {
						return callback(err, __line);
					}
					
					var content = data.split("\n");
					
					if(content[0].trim() == email) {
						callback(err, __line, true, content, files[i]);
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
					callback(err, __line, false);
				}
				
				clearInterval(i_id);
			}
		}, 0);
	});
}

exports.findSession = function findSessionMatch(session, callback) { // Currently unused; should it be removed?
	fs.readdir('users', function(err, files) {
		if(err) {
			return callback(err, __line);
		}
		
		var session_found = false;
		var files_processed = 0;
		
		for(i = 0; i < files.length; i++) {
			if(files[i] == "user.txt") {
				files_processed++;
			} else {
				fs.readFile('users/' + files[i] + '/user.txt', 'utf8', function(err, data) {
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
	fs.readFile("users/user.txt", 'utf8', function(err, data) {
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
				
				callback();
			});
		});
	});
}

exports.changeProp = function editLine(usr, prop, val, callback) {
    var usrpath = "users/" + usr + "/user.txt";
    
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
	fs.readdir('users', function(err, files) {
		if(err) {
			return callback(err, __line);
		}
		
		var deadUsr_found = false;
		var files_processed = 0;
		
		for(i = 0; i < files.length; i++) {
			if(files[i] == "user.txt") {
				files_processed++;
			} else {
				fs.readFile('users/' + files[i] + '/server/.properities', 'utf8', function(err, data) {
					if(err) {
						return callback(err, __line);
					}
					
					var content = data.split("\n");
					var today = new Date();
					
					if(today.getTime() - content[3].trim() > 8589934591) {
						rmdirAsync('users/' + files[i] + '/server', function(err) {
							if(err) {
								return callback(err, __line);
							}
							
							callback(err, __line, true);
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
					callback(err, __line, false);
				}
				
				clearInterval(i_id);
			}
		}, 0);
	});
}
