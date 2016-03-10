var fs = require('fs');

exports.addLine = function addLine(dir, item) {
	var fileRes = fs.readFile(dir, 'utf8', function(err, data) {
		if(err) {
			return err;
		}
		
		var items = data.split("\n");
		items.push(item);
		items = items.join("\n");
		var fileRes2 = fs.writeFile(dir, items, function(err, data) {
			if(err) {
				return err;
			}
		});
		
		if(fileRes2) {
			return fileRes2;
		}
	});
	
	if(fileRes) {
		return fileRes;
	}
}

exports.fileContains = function fileContains(file, item, callback) {
	fs.readFile(file, 'utf8', function(err, data) {
		process.nextTick(function() {
			callback(err, ~data.indexOf(item));
		});
	});
}