var dir = 0;

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
		if($('#console textarea').val().substring($('#console textarea').val().length - 1, $('#console textarea').val().length) == "\n") {
			$('#console textarea').text($('#console textarea').val() + data + "\n");
		} else {
			$('#console textarea').text($('#console textarea').val() + "\n" + data + "\n");
		}
	});
	
	$("#consoleinput").on("keydown", function sendCMD(e) {
		if(e.keyCode == 13) {
			socket.emit('console-cmd', {"cmd": $(this).val(), "id": Number(getCookie("user_id")), "session": getCookie("session")});
			$(this).val("");
		}
	});
	
	$("#console textarea").on("keydown", function sendCMD(e) {
		if(e.keyCode == 13) {
			var $txt = $(this);
			if($txt.val().substring($txt.val().length - 5, $txt.val().length) == 'cd ..') {
				$txt.val($txt.val() + "\n$ themes> ");
				dir = 1;
			} else if(dir == 1 && $txt.val().substring($txt.val().length - 2, $txt.val().length) == 'ls') {
				$txt.val($txt.val() + "\ndefault terminal lol\n$ themes> ");
			} else if(dir == 1 && $txt.val().substring($txt.val().length - 6, $txt.val().length) == 'cd lol') {
				$txt.val($txt.val() + "\nlol nice want to join us & make the service better?\nhttps://github.com/NN-Dev-Team/Nordic-Network\n$ themes/lol> ");
				dir = 2;
			} else if(dir == 1 && $txt.val().substring($txt.val().length - 11, $txt.val().length) == 'cd terminal') {
				$txt.val($txt.val() + "\n$ themes/terminal> ");
				dir = 0;
			} else if(dir == 1 && $txt.val().substring($txt.val().length - 10, $txt.val().length) == 'cd default') {
				$txt.val($txt.val() + "\n$ themes/default> ");
				dir = 0;
				changeTheme(1);
			} else if(dir == 1) {
				$txt.val($txt.val() + "\n$ themes> ");
			} else if(dir == 2) {
				$txt.val($txt.val() + "\n$ themes/lol> ");
			} else {
				socket.emit('console-cmd', {"cmd": $(this).val(), "id": Number(getCookie("user_id")), "session": getCookie("session")});
				$txt.val($txt.val() + "\n$ ");
			}
			
			var device_width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
			
			if(device_width >= 1200) {
				setTimeout(function(){
					$txt.val($txt.val().substring(0, $txt.val().length - 1));
				}, 10);
			} else {
				setTimeout(function(){
					$txt.val($txt.val().substring(0, $txt.val().length - 1));
				}, 100);
			}
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

String.prototype.replaceAt=function(index, character) {
    return this.substr(0, index) + character + this.substr(index+character.length);
}

function Focus() {
	if(getCookie('console-theme') == "terminal" && $('#console textarea').val().substring($('#console textarea').val().length - 1, $('#console textarea').val().length) == "\n") {
		$('#console textarea').text($('#console textarea').val() + "$ ");
	}
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
		var $txt = $('#console textarea').val().split("\n");
		for(i = 0; i < $txt.length; i++) {
			if($txt[i].substring(0, 1) == '$') {
				$txt.splice(i, 1);
				i--;
			}
		}
		$('#console textarea').text($txt.join("\n"));
		$('#consoleinput').css('display', 'inline');
		
		// Console theme changer button
		$('#cnslchangecolor').attr('onclick', "changeTheme(0)");
		
		// Remove theme cookie
		delCookie('console-theme');
	}
}