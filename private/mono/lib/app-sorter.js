var fs = require('fs');
var path = require('path');

function checkSpelling(app, callback) {
	callback(err, 5); // WIP; this callback is temporary
}

exports.checkApp = function(app, callback) { 
	fs.readFile(path.join(__dirname, '../apps/new/', app), 'utf8', function(err, data) {
		if(err) {
			return callback({"error": err, "line": __line});
		}
		
		data = data.replace(/(\r)/gm, "");
		var rows = data.split('\n');
		data = data.replace(/(\r)/gm, "");
		var words = data.split(' ');
		
		var word_count = words.length;
		var row_count = rows.length;
		
		if(word_count >= 300 && word_count <= 1000 && row_count >= 2 && row_count <= 10) {
			var approvalPoints = 0;
			var avr_word_count = 500; // Change this later
			var avr_row_count = 5; // Change this later
			approvalPoints += 1000 - Math.abs(word_count - avr_word_count);
			approvalPoints += 10 - Math.abs(row_count - avr_row_count);
			
			checkSpelling(app, function(err, err_percentage) {
				if(err) {
					return callback({"error": err, "line": __line});
				}
				
				if(err_percentage < 3) {
					callback(); // WIP; this callback is temporary
				} else {
					// Application DECLINED; too many spelling errors
					// Delete application file
					
					fs.unlink(dir + '/' + file, function(err) {
						if(err) {
							return callback({"error": err, "line": __line});
						}
						
						callback(err, false);
					});
				}
			});
		} else {
			
			// Application DECLINED; too short
			// Delete application file
			
			fs.unlink(path.join(__dirname, '../apps/', file), function(err) {
				if(err) {
					return callback({"error": err, "line": __line});
				}
				
				callback(err, false);
			});
		}
	});
}