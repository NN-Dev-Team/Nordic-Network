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
}