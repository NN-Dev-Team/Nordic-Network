// THIS FILE IS NOT NEAR DONE

var path = require('path');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');

var values = [];

fs.readFile('../public/properities.txt', 'utf8', function (err, data) {
	if (err) {
		return console.log(err);
	}
	values = data.split("\n");
	var port = values[1];
	http.listen(port, function(){
		console.log('listening on *:' + port);
	});

});

io.on('connection', function(socket){
	socket.on('start-server', function(data){
		io.emit('server-checked', { "success": false, "reason": "Start button is still WIP :P"});
	});
});