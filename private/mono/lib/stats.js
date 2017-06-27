var exec = require('child_process').exec;
var user = require('./user-lib.js');
var fs = require('fs');
var path = require('path');

const HARDWARE_COSTS = 102; // £
const TOTAL_RAM = 62; // GB (actually 64 GB but 2 GB is reserved for other processes)

const poundTo$ = 1.25; // £1 = $1.25

//////////////// '../stats.txt' file structure //////////////////////
//                                                                 //
//  LINE 0: Current balance (in £); number                         //
//  LINE 1: Next payment date; number (ms since 1970)              //
//                                                                 //
/////////////////////////////////////////////////////////////////////

exports.getHWCosts = function() {
	return HARDWARE_COSTS;
}

exports.getTotalRAM = function() {
	return TOTAL_RAM;
}

exports.getMain = function(callback) {
	user.getTotal(function(err, serverCount) {
		if(err) {
			return callback({"error": err.error, "id": 1, "line": __line + "." + err.line});
		}
		
		exec("free -m", function(err, out, stderr) {
			if(err) {
				return callback({"error": err, "id": 2, "line": __line});
			}
			
			var c = out.indexOf("-/+ buffers/cache");
			
			while(!(Number(out[c]))) {
				c++;
			}
			
			var mem_max = "";
			
			while(Number(out[c])) {
				mem_max += out[c];
				c++;
			}
			
			while(!(Number(out[c]))) {
				c++;
			}
			
			var mem_used = "";
			
			while(Number(out[c])) {
				mem_used += out[c];
				c++;
			}
			
			callback(err, serverCount, mem_max, mem_used);
		});
	});
}

exports.getServerData = function(process, callback) {
	fs.readdir(path.join(__dirname, '../users'), function(err, files) {
		if(err) {
			return callback({"error": err, "line": __line});
		}
		
		var files_processed = 0;
		
		for(i = 0; i < files.length; i++) {
			(function(file) {
				if(file == "user.txt" || file == "ips.txt") {
					files_processed++;
					
					if(files_processed == files.length) {
						callback();
					}
				} else {
					fs.readFile(path.join(__dirname, '../users/', file, '/server/.properties'), 'utf8', function(err, data) {
						if(err) {
							return callback({"error": err, "line": __line});
						}
						
						process(data.split("\n"));
						
						files_processed++;
						
						if(files_processed == files.length) {
							callback();
						}
					});
				}
			})(files[i]);
		}
	});
}

exports.updateBalance = function(callback) {
	fs.readFile(path.join(__dirname, '../stats.txt'), 'utf8', function(err, data) {
		var stats = data.split("\n");
		
		if(new Date().getTime() >= Number(stats[1].trim())) {
			var income = 0;
			
			exports.getServerData(function(props) {
				var donations = props[5].trim();
				
				if(donations[0] == '£') {
					income += Number(donations.substring(1));
				} else if(donations[0] == '$') {
					income += Number(donations.substring(1)) / poundTo$;
				} else {
					console.log("[WARNING] Currency '" + donations[0] + "' is not supported! Convert this manually: " + donations);
				}
			}, function(err) {
				if(err) {
					return callback({"error": err.error, "id": 1, "line": __line + '.' + err.line});
				}
				
				console.log("[DEBUG] Total donations: £" + income); // WILL BE CHANGED LATER
				
				callback();
			});
		} else {
			callback();
		}
	});
}