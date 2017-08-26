var fs = require('fs');
var path = require('path');

function checkSpelling(app) {
	return [err, 5]; // WIP; this is temporary
}

exports.checkApp = function(app) { 
	fs.readFile(path.join(__dirname, '../apps/new/', app), 'utf8', function(err, data) {
		if(err) {
			return {"error": err, "line": __line};
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
			
			var res = checkSpelling(app);
			var err = res[0];
			var err_percentage = res[1];
			if(err) {
				return {"error": err, "line": __line};
			}
				
			if(err_percentage < 3) {
				return [err, true]; // WIP; this is temporary
			} else {
				// Application DECLINED; too many spelling errors
				// Delete application file
				
				fs.unlink(dir + '/' + file, function(err) {
					if(err) {
						return {"error": err, "line": __line};
					}
					
					return;
				});
			}
		} else {
			
			// Application DECLINED; too short
			// Delete application file
			
			fs.unlink(path.join(__dirname, '../apps/', file), function(err) {
				if(err) {
					return {"error": err, "line": __line};
				}
				
				return;
			});
		}
	});
}