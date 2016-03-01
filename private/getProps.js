var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');

var values = [];
var props = [];

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

exports.express = express;
exports.app = app;
exports.http = http;
exports.io = io;

exports.values = values;
exports.props = props;