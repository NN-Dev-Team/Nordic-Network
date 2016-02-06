var path = require('path');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var bcrypt = require('bcryptjs');
var toobusy = require('toobusy');

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

app.use(function(req, res, next) {
	if (toobusy()) res.send(503, "Sorry, either we're too popular or someone is DDoS:ing (Server is overloaded)");
	else next();
});

// REMOVE THIS WHEN PUTTING THE CODE ONLINE                            |
app.get('/', function(req, res) { //                                   |
    res.sendFile(path.join(__dirname + '/test-client-reg.html')); // |
}); //                                                                 v

function printError(reason, id) {
	io.emit('reg-complete', {"success": false, "reason": reason, "id": id});
}

io.on('connection', function(socket){
	socket.on('register', function(data){
		if(typeof data.email != 'string' || typeof data.pass != 'string') {
			return printError("Invalid email and/or password.", 0);
		}
		
		if(((data.email).indexOf("@") != -1) && ((data.email).indexOf(".") != -1)) {
			bcrypt.genSalt(10, function(err, salt) {
				if(err) {
					return printError(err, 1);
				}
				
				bcrypt.hash(data.pass, salt, function(err, hash) { 
					if(err) {
						return printError(err, 2);
					}
					
					fs.readFile("users/user.txt", 'utf8', function(error, dat) {
						if(err) {
							return printError(error, 3);
						}
						
						values = dat.split("\n");
						fs.writeFile("users/" + values[0].toString() + ".txt", data.email + "\n" + hash, function(err, data) {
							if(err) {
								return printError(err, 4);
							}
							
							fs.writeFile("users/user.txt", Number(values[0]) + 1, function(err, data) {
								if(err) {
									return printError(err, 5);
								}
								
								io.emit('reg-complete', {"success": true});
							});
						});
					});
				});
			});
		} else {
			printError("This is impossible unless you hacked :/", 6);
		}
	});
});
