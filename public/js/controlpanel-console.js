var values = [];
var host = "N/A";
var port = -1;

$(document).ready(function() {
	$('#login-failure').css('display', 'none');
	
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
	}
	
	if(getCookie('console-theme') == "terminal") {
		$('#console').css('transition', "none");
		$('#cnslchangecolor').css('transition', "none");
		$('#cnslautochat').css('transition', "none");
		$('#consoleinput').css('transition', "none");
		$('#console textarea').css('transition', "none");
		changeTheme(0);
		setTimeout(function(){
			$('#console').css('transition', "border-radius 2s, background-color 2s, height 2s, border 2s");
			$('#cnslchangecolor').css('transition', "background-color 2s, color 2s");
			$('#cnslautochat').css('transition', "background-color 2s, color 2s");
			$('#consoleinput').css('transition', "display 2s");
			$('#console textarea').css('transition', "border-top-left-radius 2s, background-color 2s, border-right 2s, color 2s, height 2s");
		}, 100);
	}
	
	socket.on('console-query', function(data){
		$('#console textarea').text(data);
	});
	
	$("#consoleinput").on("keydown", function sendCMD(e) {
		if(e.keyCode == 13) {
			socket.emit('console-cmd', $(this).val());
			$(this).val("");
		}
	});
	
	$("#console textarea").on("keydown", function sendCMD(e) {
		if(e.keyCode == 13) {
			socket.emit('console-cmd', $(this).val());
			$(this).val("$ ");
		}
	});
});

function addCookie(name, value, time) {
    var day = new Date();
    day.setTime(day.getTime() + (time*24*60*60*1000));
    var expires = "expires="+day.toUTCString();
    document.cookie = name + "=" + value + "; " + expires + "; path=/";
}

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

function changeTheme(state) {
	var device_width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
	
	if(state == 0) {
		// Console
		$('#console').css('border-radius', 0);
		$('#console').css('background-color', "black");
		if(device_width < 768) {
			$('#console').css('height', "calc(100vh - 151px)");
		} else if(device_width > 1919) {
			$('#console').css('height', "calc(65vh - 40px)");
		} else {
			$('#console').css('height', "calc(60vh - 30px)");
		}
		$('#console').css('border', "1px solid gray");
		
		// Console buttons
		$('#cnslchangecolor').css('background-color', "black");
		$('#cnslchangecolor').css('color', "white");
		$('#cnslautochat').css('background-color', "black");
		$('#cnslautochat').css('color', "white");
		
		// Console IO
		$('#consoleinput').css('display', 'none');
		$('#console textarea').removeAttr('readonly');
		$('#console textarea').css('border-top-left-radius', 0);
		$('#console textarea').css('background-color', "black");
		$('#console textarea').css('border-right', "1px solid gray");
		$('#console textarea').css('color', "white");
		if(device_width < 768) {
			$('#console textarea').css('height', "calc(100vh - 153vh)");
		} else if(device_width > 1919) {
			$('#console textarea').css('height', "calc(65vh - 42px)");
		} else {
			$('#console textarea').css('height', "calc(60vh - 32px)");
		}
		$('#console textarea').text("$ cd themes/terminal\n$ themes/terminal> ");
		
		// Console theme changer button
		$('#cnslchangecolor').attr('onclick', "changeTheme(1)");
		
		// Add theme cookie
		addCookie('console-theme', "terminal", 1024);
	} else {
		// Console
		$('#console').css('border-radius', "10px");
		$('#console').css('background-color', "white");
		if(device_width < 768) {
			$('#console').css('height', "calc(100vh - 126px)");
		} else if(device_width > 1919) {
			$('#console').css('height', "65vh");
		} else {
			$('#console').css('height', "60vh");
		}
		$('#console').css('border', "1px solid black");
		
		// Console buttons
		$('#cnslchangecolor').css('background-color', "white");
		$('#cnslchangecolor').css('color', "");
		$('#cnslautochat').css('background-color', "white");
		$('#cnslautochat').css('color', "");
		
		// Console IO
		$('#console textarea').attr('readonly', "");
		$('#console textarea').css('border-top-left-radius', "10px");
		$('#console textarea').css('background-color', "");
		$('#console textarea').css('border-right', "1px solid black");
		$('#console textarea').css('color', "");
		if(device_width < 768) {
			$('#console textarea').css('height', "calc(100vh - 151px)");
		} else if(device_width > 1919) {
			$('#console textarea').css('height', "calc(65vh - 40px)");
		} else {
			$('#console textarea').css('height', "calc(60vh - 30px)");
		}
		$('#consoleinput').css('display', 'inline');
		
		// Console theme changer button
		$('#cnslchangecolor').attr('onclick', "changeTheme(0)");
		
		// Remove theme cookie
		delCookie('console-theme');
	}
}