var values = [];
var host = "N/A";
var port = -1;

if (!String.prototype.format) {
	String.prototype.format = function() {
		var args = arguments;
		return this.replace(/{(\d+)}/g, function(match, number) { 
			return typeof args[number] != 'undefined'
				? args[number]
				: match
			;
		});
	};
}

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

function addAnimations() {
	$('#nav-nomargin').css('transition', 'all 0.5s');
}

$(document).ready(function(){
	var cookiesAccepted = getCookie('displayCookieConsent');
	if(cookiesAccepted != 'y') {
		$('#cookie-notice').css('display', 'block');
		$('#cookie-notice-button').css('display', 'inline-block');
		$('#jumbo-container').css('margin-bottom', '30vh');
	}
	
	$(".pricing-box-free").hover(function() {
		$(this).css("border", "1px solid #7b6");
		$(this).css("border-bottom", "50px solid #7b6");
	}, function() {
		$(this).css("border", "1px solid #9c7");
		$(this).css("border-bottom", "50px solid #9c7");
	});
	
	$(".pricing-box-premium").hover(function() {
		$(this).css("border", "1px solid #85b");
		$(this).css("border-bottom", "50px solid #85b");
	}, function() {
		$(this).css("border", "1px solid #97c");
		$(this).css("border-bottom", "50px solid #97c");
	});
	
	$.get("../properties.txt", function(data) {
        values = data.split("\n");
		
		host = values[0].trim();
		port = Number(values[1]);
	}).fail(function() {
		console.log("ERROR: Failed to get server IP");
	}).done(function() {
		var socket = io('http://' + host + ":" + port);
		if(socket.disconnected) {
			console.log("ERROR: Unable to connect to server.");
		}
		
		socket.on('main-stats', function(data) {
			if(data.success) {
				console.log("Successfully received stats!");
				if(data.info.servers) {
					$('#stats-servers').html((data.info.servers).toLocaleString()); // Amount of servers created
				}
				
				// data.info.max = Total memory, data.info.used = Used memory.
			} else {
				console.log("Failed to get stats");
				console.log("Reason: " + data.reason);
				console.log("ID: " + data.id);
			}
		});
    }, 'text');
});

function acceptCookies() {
	addCookie('displayCookieConsent', 'y', 256);
	$('#cookie-notice').css('display', 'none');
	$('#cookie-notice-button').css('display', 'none');
	$('#jumbo-container').css('margin-bottom', '40vh');
}

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
