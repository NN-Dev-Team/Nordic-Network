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
		addCookie("user_id", data.info.user, 1);
		addCookie("session", data.info.session, 1);
		location.reload();
	} else {
		sweetAlert("Failed to login", "Reason: " + data.reason + "\nID: " + data.id, "error");
	}
});

$('form').submit(function(){
    socket.emit('login', {email: $('#email').val(), pass: $('#passwrd'.val())});
    return false;
});