var traffic = [];

function getIDFromIP(IP) {
	for(var i = 0; i < traffic.length; i++) {
		if(traffic[i][0] == IP) {
			return i;
		}
	}
}

exports.resetTraffic = function() {
	for(var i = 0; i < traffic.length; i++) {
		traffic[i][1] = 0;
	}
}

exports.isBlocked = function(IP, callback) {
	var id = getIDFromIP(IP);
	
	if(typeof id === "undefined") {
		callback({"isRegistered": false});
	} else {
		callback({"isBlocked": traffic[id][1] > 64, "isRegistered": true});
	}
}

exports.register = function(IP, val, callback) {
	traffic.push([IP, val]);
}

exports.log = function(IP, incr) {
	traffic[getIDFromIP(IP)][1] += incr;
}

exports.removeIP = function(IP) {
	traffic.splice(getIDFromIP(IP), 1);
}