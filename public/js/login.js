var values = [];
var host = "N/A";
var port = -1;

$(document).ready(function() {
	$('#login-failure').css('display', 'none');
	
    $.get("../properities.txt", function(data) {
        values = data.split("\n");
		return values;
    }, 'text');
	
	host = values[0].trim();;
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
	
	socket.on('login-complete', function(data){
		if(data.success){
			addCookie("user_id", data.info.user, 1);
			addCookie("session", data.info.session, 1);
			location.reload();
		} else {
			swal("Failed to login", "Reason: " + data.reason + "\nID: " + data.id, "error");
		}
	});
	
	$('form').submit(function(){
		socket.emit('login', {email: $('#email').val(), pass: $('#passwrd'.val())});
		return false;
	});
});

function addCookie(name, value, time) {
    var day = new Date();
    day.setTime(day.getTime() + (time*24*60*60*1000));
    var expires = "expires="+day.toUTCString();
    document.cookie = name + "=" + value + "; " + expires + "; path=/";
}