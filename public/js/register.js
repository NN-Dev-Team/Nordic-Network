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

host = values[0].trim();
port = Number(values[1]);

if(host == "N/A" || port == -1) {
	swal("Unable to connect to server.", "", "error");
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
		swal("Failed to register", "Reason: " + data.reason + "\nID: " + data.id, "error");
	}
});

$('form').submit(function(){
    socket.emit('register', {email: $('#email').val(), pass: $('#passwrd'.val())});
    return false;
});