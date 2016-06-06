"use strict";

var values = [];
var host = "N/A";
var port = -1;

$(document).ready(function() {
	$('#login-failure').css('display', 'none');
	
    $.get("../properities.txt", function(data) {
        values = data.split("\n");
		return values;
    }, 'text');
	return values;
});

host = values[0];
port = Number(values[1]);

if(host == "N/A" || port == -1) {
	console.log("ERROR: Couldn't find host/port");
} else {
	console.log("Creating socket...");
	var socket = io('http://' + host + ":" + port);
	if(typeof socket === 'undefined') {
		console.log("Failed to create socket");
	} else {
		console.log("Successfully created socket");
	}
}

function addCookie(name, value, time) {
    var day = new Date();
    day.setTime(day.getTime() + (time*24*60*60*1000));
    var expires = "expires="+day.toUTCString();
    document.cookie = name + "=" + value + "; " + expires + "; path=/";
}

socket.on('login-complete', function(data){
	if(data.success){
		console.log("Successfully logged in!");
		addCookie("session", data.session, 1);
		location.reload();
	} else {
		console.log("Failed to login.");
		console.log("Reason: ", data.reason);
		console.log("ID: ", data.id);
		$('#login-failure').css('display', 'block');
		$('#login-failure #reason').html('Reason:' + data.reason);
		$('#login-failure #err-id').html('Error ID:' + data.id);
	}
});

$('form').submit(function(){
	console.log("Logging in...");
    socket.emit('login', {email: $('#email').val(), pass: $('#passwrd'.val())});
    return false;
});