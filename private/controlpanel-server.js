// THIS FILE IS NOT NEAR DONE

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');

var values = [];

fs.readFile('../public/properities.txt', 'utf8', function (err, data) {
	if (err) {
		return console.log(err);
	}
	values = data.split("\n");
});

var port = values[1];

app.get('/', function(req, res){ // For those who think res means resolution it doesn't; it means result
	res.sendFile(__dirname + '../public/controlpanel.html'); // ethernity4ever what is the name of the control panel html file?
});

io.on('connection', function(socket){
	socket.on('example', function(data){
		io.emit('example received', data);
	});
});

http.listen(port, function(){
	console.log('listening on *:' + port);
});