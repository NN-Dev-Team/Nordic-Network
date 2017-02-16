var traffic = [];

function getIDFromSocket(socket) {
	for(var i = 0; i < traffic.length; i++) {
		if(traffic[i][0] == socket) {
			return i;
		}
	}
}

exports.resetTraffic = function reset() {
	for(var i = 0; i < traffic.length; i++) {
		traffic[i][1] = 0;
	}
}

exports.isBlocked = function checkTraffic(socket, callback) {
	var id = getIDFromSocket(socket);
	
	if(typeof id === "undefined") {
		callback({"isRegistered": false});
	} else {
		callback({"isBlocked": traffic[id][1] > 64, "isRegistered": true});
	}
}

exports.register = function addSocket(socket, val, callback) {
	traffic.push([socket, val]);
}

exports.log = function incrTraffic(socket, incr) {
	traffic[getIDFromSocket(socket)][1] += incr;
}

exports.removeSession = function forgetSocket(socket) {
	traffic.splice(getIDFromSocket(socket), 1);
}