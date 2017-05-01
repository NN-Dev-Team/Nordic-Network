var exec = require('child_process').exec;

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