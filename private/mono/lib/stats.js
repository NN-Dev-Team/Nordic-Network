var exec = require('child_process').exec;
var user = require('./user-lib.js');
var fs = require('fs');
var path = require('path');

const HARDWARE_COSTS = 102; // £

exports.getHWCosts = function getHWCostsConst() {
	return HARDWARE_COSTS;
}

exports.getMain = function getMainStats(callback) {
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

exports.getServerData = function getServerStats(callback) {
	fs.readdir(path.join(__dirname, '../users'), function(err, files) {
		if(err) {
			return callback({"error": err, "id": 1, "line": __line});
		}
		
		var stats = [];
		var files_processed = 0;
		
		for(i = 0; i < files.length; i++) {
			(function(file) {
				if(file == "user.txt" || file == "ips.txt") {
					files_processed++;
				} else {
					fs.readFile(path.join(__dirname, '../users/', file, '/server/.properties'), 'utf8', function(err, data) {
						if(err) {
							return callback({"error": err, "id": 2, "line": __line});
						}
						
						stats.push(data.split("\n"));
						
						files_processed++;
						
						if(files_processed == files.length) {
							callback(err, stats);
						}
					});
				}
			})(files[i]);
		}
	});
}

exports.getServerDataProperty = function getServerStatsProperty(property, callback) { // ~33% faster than using getServerData and then reading the array outputted to get the desired property
	fs.readdir(path.join(__dirname, '../users'), function(err, files) {
		if(err) {
			return callback({"error": err, "id": 1, "line": __line});
		}
		
		var stats = [];
		var files_processed = 0;
		
		for(i = 0; i < files.length; i++) {
			(function(file) {
				if(file == "user.txt" || file == "ips.txt") {
					files_processed++;
				} else {
					fs.readFile(path.join(__dirname, '../users/', file, '/server/.properties'), 'utf8', function(err, data) {
						if(err) {
							return callback({"error": err, "id": 2, "line": __line});
						}
						
						stats.push(data.split("\n")[property]);
						
						files_processed++;
						
						if(files_processed == files.length) {
							callback(err, stats);
						}
					});
				}
			})(files[i]);
		}
	});
}

exports.getRanksFromData = function getRankCountFromData(data) { // Use this together with getServerData or getServerDataProperty when you want to access the ranks AND other stuff at the same time
	var ranks = [0, 0, 0, 0, 0, 0, 0, 0];
	
	if(typeof data[0] === 'number') { // Check if data comes from getServerData or getServerDataProperty
		for(var i = 0; i < data.length; i++) {
			ranks[data[i]]++;
		}
	} else {
		for(var i = 0; i < data.length; i++) {
			ranks[data[i][2]]++;
		}
	}
	
	return ranks;
}

// This function is ~33% faster than combining getRanksFromData with getServerData or getServerDataProperty; use it when you ONLY want to access the ranks
exports.getRanks = function getRankCount(callback) {
	fs.readdir(path.join(__dirname, '../users'), function(err, files) {
		if(err) {
			return callback({"error": err, "id": 1, "line": __line});
		}
		
		var ranks = [0, 0, 0, 0, 0, 0, 0, 0];
		var files_processed = 0;
		
		for(i = 0; i < files.length; i++) {
			(function(file) {
				if(file == "user.txt" || file == "ips.txt") {
					files_processed++;
				} else {
					fs.readFile(path.join(__dirname, '../users/', file, '/server/.properties'), 'utf8', function(err, data) {
						if(err) {
							return callback({"error": err, "id": 2, "line": __line});
						}
						
						ranks[data.split("\n")[2]]++;
						
						files_processed++;
						
						if(files_processed == files.length) {
							callback(err, ranks);
						}
					});
				}
			})(files[i]);
		}
	});
}