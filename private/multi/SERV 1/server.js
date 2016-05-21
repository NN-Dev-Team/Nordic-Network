var toobusy = require('toobusy-js');
var user = require('./user-extras.js');
// var mcLib = require('./auto-updater.js');
var fs = require('fs');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var bcrypt = require('bcryptjs');
var randomstring = require('randomstring');
var mkdir = require('mkdirp');
var exec = require('child_process').exec;

var values = [];
var props = [];
var valid = false;
var doneSearching = false;
var IP = '';

fs.readFile('properities.txt', 'utf8', function (err, data) {
	if (err) {
		return console.log(err);
	}
	
	values = data.split("\n");
	IP = values[0];
	var port = values[1];
	
	http.listen(port, function(){
		console.log('listening on *:' + port);
	});
});

app.use(function(req, res, next) {
	if (toobusy()) {
		res.send(503, "Sorry, either we're too popular or someone is DDoS:ing (Server is overloaded)");
	} else {
		next();
	}
});

io.on('connection', function(socket){
/*	var _IP = socket.request.connection.remoteAddress;
	if(_IP == IP) { */
		
		// REGISTRATION
		socket.on('find-user', function(data){
			user.find(data.email, function(err, found, dat) {
				if(err) {
					return io.emit('done-looking', {"err": err});
				}
				
				io.emit('done-looking', {"err": false, "found": found});
			});
		});
//	}
});