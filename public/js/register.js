var values = [];
var host = "N/A";
var port = -1;

$(document).ready(function() {
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

socket.on('reg-complete', function(data){
	if(data.success){
		location.reload();
	} else {
		sweetAlert("Failed to register", "Reason: " + data.reason + "\nID: " + data.id, "error");
	}
});

$('form').submit(function(){
    socket.emit('register', {email: $('#email').val(), pass: $('#passwrd'.val())});
    return false;
});