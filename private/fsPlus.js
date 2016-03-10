var fs = require('fs');

exports.addLine = function addLine(dir, item, callback) {
	fs.readFile(dir, 'utf8', function(err, data) {
		if(err) {
			return callback(err);
		}
		
		var items = data.split("\n");
		items.push(item);
		items = items.join("\n");
		fs.writeFile(dir, items, function(err, data) {
			if(err) {
				return callback(err);
			}
			
			callback(err, data);
		});
	});
}

exports.fileContains = function fileContains(file, item, callback) {
	fs.readFile(file, 'utf8', function(err, data) {
		process.nextTick(function() {
			callback(err, ~data.indexOf(item));
		});
	});
}