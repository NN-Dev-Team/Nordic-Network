var fs = require('fs');

function addLine(dir, item) {
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

function fileContains(file, item) {
	fs.readFile(file, 'utf8', function(err, data) {
		callback(err, ~data.indexOf(item));
	});
}