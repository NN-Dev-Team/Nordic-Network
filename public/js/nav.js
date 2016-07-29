var values = [];
var host = "N/A";
var port = -1;

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
    $.get("../properities.txt", function(data) {
        values = data.split("\n");
		return values;
    }, 'text');
	
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
        
        $('button #logout').click(function(){
            socket.emit('logout', {"id": getCookie("user_id"), "session": getCookie("session")});
            delCookie('session');
            return false;
        });
        
        socket.on('logout-complete', function(data) {
            if(data.success) {
                delCookie('session');
                console.log("Successfully logged out!");
            } else {
                console.log("Failed to logout. (Somehow?!)");
                console.log("Reason: ", data.reason);
                console.log("ID: ", data.id);
            }
        });
	}
});

// OLD CODE
/* $(window).bind("load", function() {
	function prepare() {
		var nav_height = $("#banner").height() + 10;
		$("#nav-bar").height(nav_height);
		$("li.horizontal a").css("line-height", nav_height / 2 + "px");
		$("li.horizontal a").css("font-size", nav_height*0.25);
		$("#status").css("top", nav_height + 20 + "px");
	}
	prepare();
	
	window.onorientationchange = function() {
		prepare();
	}
}); */