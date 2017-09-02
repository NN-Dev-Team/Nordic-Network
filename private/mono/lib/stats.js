var exec = require('child_process').exec;
var user = require('./user-lib.js');
var fs = require('fs');
var path = require('path');

const HARDWARE_COSTS = 102; // £
const TOTAL_RAM = 62; // GB (actually 64 GB but 2 GB is reserved for other processes)

const poundTo$ = 1.3; // £1 = $1.3

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
		if(err) {
			return callback({"error": err, "id": 1, "line": __line});
		}
		
		var stats = data.split("\n");
		
		if(new Date().getTime() >= Number(stats[1].trim())) {
			var income = 0;
			var income_per_rank = [0, 0, 0, 0, 0, 0, 0, 0];
			var ranks = [0, 0, 0, 0, 0, 0, 0, 0];
			
			exports.getServerData(function(props) {
				var donations = props[5].trim();
				var rank = Number(props[2].trim());
				
				// Currency convertion will be done using Stripe API when implemented
				if(donations[0] == '£') {
					var val = Number(donations.substring(1));
					
					income += val;
					income_per_rank[rank] += val;
				} else if(donations[0] == '$') {
					var val = Number(donations.substring(1)) / poundTo$;
					
					income += val;
					income_per_rank[rank] += val;
				} else {
					console.log("[WARNING] Currency '" + donations[0] + "' is not supported! Convert this manually: " + donations);
				}
				
				ranks[rank]++;
			}, function(err) {
				if(err) {
					return callback({"error": err.error, "id": 3, "line": __line + '.' + err.line});
				}
				
				stats[0] = Number(stats[0].trim()); // Making sure we only get a number
				stats[0] -= HARDWARE_COSTS;
				stats[0] += income;
				
				stats[1] = Number(stats[1].trim());
				stats[1] += 30 * 24 * 60 * 60 * 1000;
				
				// DEBUG INFO; WILL BE REMOVED LATER
				console.log("[DEBUG] Income: £" + income);
				console.log("[DEBUG] Expenses: £" + HARDWARE_COSTS);
				
				fs.writeFile(path.join(__dirname, '../stats.txt'), stats.join("\n"), function(err) {
					if(err) {
						return callback({"error": err, "id": 4, "line": __line});
					}
					
					callback(err, {"newBalance": stats[0], "ranks": ranks, "rankIncome": income_per_rank});
				});
			});
		} else {
			callback({"id": 2});
		}
	});
}

exports.tweakXP = function(data, callback) {
	fs.readFile(path.join(__dirname, '../ranks.txt'), 'utf8', function(err, dat) {
		if(err) {
			return callback({"error": err, "id": 1, "line": __line});
		}
		
		var XP = dat.replace(/(\r\n|\n|\r)/gm," ").split(" ");
		for(var i = 0; i < XP.length; i++) {
			// WIP
		}
	});
}