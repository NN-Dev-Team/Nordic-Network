var values = [];
var host = "N/A";
var port = -1;

var err_reported = false;

function getCookie(name) {
    name += "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}

function delCookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

$(document).ready(function() {
	 $.get("properties.txt", function(data) {
        values = data.split("\n");
		
		host = values[0].trim();
		port = Number(values[1]);
	}).fail(function() {
		swal("Failed to get server IP", "Please contact our admins about this error so we can fix it as soon as possible!", "error");
	}).done(function() {
		if(port) {
			var socket = io('https://' + host + ":" + port);
		} else {
			var socket = io('https://' + host);
		}
		
		socket.on('connect_error', function() {
			if(!err_reported) {
				swal("Unable to connect to server.", "It seems our game servers are down.\nPlease be patient while we work on a fix!", "error");
				err_reported = true;
			}
		});
		
		socket.on('disconnect', function() {
			swal("Disconnected from server", "Hmm, looks like something went wrong. Please report this to our development team at https://github.com/NN-Dev-Team/Nordic-Network/issues", "error");
		});
		
		$('#logout-button').click(function(){
			socket.emit('logout', {"id": getCookie("user_id"), "session": getCookie("session")});
			delCookie('user_id');
			delCookie('session');
		});
		
		socket.on('logout-complete', function(data) {
			if(!data.success) {
				swal("Failed to logout.", "Somehow?!", "error");
			}
		});
    }, 'text');
});

function changeFlag(c) {
	if(c == 0) {
		$('#changeCurrency img').attr("src", "pics/icons/uk-icon.png");
		$('#changeCurrency img').css("visibility", "visible");
	} else if(c == 1) {
		$('#changeCurrency img').attr("src", "pics/icons/us-icon.png");
		$('#changeCurrency img').css("visibility", "visible");
	}
}
