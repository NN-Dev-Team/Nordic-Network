var fs = require('fs');

exports.addLine = function(path, data, callback) {
	fs.readFile(path, 'utf8', function(err, dat) {
		if(err) {
			return callback({"error": err, "line": __line});
		}
		
		var rows = data.split("\n");
		rows.push(data);
		
		fs.writeFile(path, rows.join("\n") ,function(err, data) {
			if(err) {
				return callback({"error": err, "line": __line});
			}
			
			callback();
		});
	});
}

exports.editLine = function(path, line, data, callback) {
	fs.readFile(path, 'utf8', function(err, dat) {
		if(err) {
			return callback({"error": err, "line": __line});
		}
		
		var rows = data.split("\n");
		rows[line] = data;
		
		fs.writeFile(path, rows.join("\n") ,function(err, data) {
			if(err) {
				return callback({"error": err, "line": __line});
			}
			
			callback();
		});
	});
}