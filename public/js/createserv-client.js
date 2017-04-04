var values = [];
var host = "N/A";
var port = -1;

var transparent = true;

function changeOpacity() {
	if(transparent && (window.scrollY || $('.navbar-toggle').attr("aria-expanded") == "true")) {
		$('#nav-nomargin').css('background-color', 'rgba(248, 248, 248, 0.95)');
		$('#nav-nomargin').css('box-shadow', '0 1px 1px rgba(127, 127, 127, 0.4)');
		$('.navbar-default').css('border-bottom', '1px solid rgba(127, 127, 127, 0.4)');
		$('#navbar-logo').css('color', '#888');
		$('#myNavbar > ul > li > a').css('color', "#888");
		
		transparent = false;
	} else if(!window.scrollY) {
		$('#nav-nomargin').css('background-color', 'transparent');
		$('#nav-nomargin').css('box-shadow', '0 1px 1px rgba(127, 127, 127, 0)');
		$('.navbar-default').css('border-bottom', '1px solid rgba(127, 127, 127, 0)');
		$('#navbar-logo').css('color', '#fff');
		$('#myNavbar > ul > li > a').css('color', "#fff");
		
		transparent = true;
	}
}

$(document).ready(function() {
    $.get("../properties.txt", function(data) {
        values = data.split("\n");
		
		host = values[0].trim();
		port = Number(values[1]);
	}).fail(function() {
		swal("Failed to get server IP", "Please contact our admins about this error so we can fix it as soon as possible!", "error");
	}).done(function() {
		if(port) {
			var socket = io('http://' + host + ":" + port);
		} else {
			var socket = io('http://' + host);
		}
		
		socket.on('disconnect', function() {
			swal("Unable to connect to server.", "It seems our game servers are down.\nPlease be patient while we work on a fix!", "error");
		});
		
		socket.on('creation-complete', function(data){
			if(data.success){
				console.log("Successfully created server!");
				addCookie("user_id", data.info.id, 0.1);
			} else {
				swal("Failed to create server", "Reason: " + data.reason + "\nID: " + data.id, "error");
			}
		});
		
		$('button #create-server').click(function(){
			socket.emit('create-serv', { "id": Number(getCookie("user_id")), "session": getCookie("session"), "type": type });
			console.log("Starting server...");
		});
    }, 'text');
});

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

function addCookie(name, value, time) {
    var day = new Date();
    day.setTime(day.getTime() + (time*24*60*60*1000));
    var expires = "expires="+day.toUTCString();
    document.cookie = name + "=" + value + "; " + expires + "; path=/";
}