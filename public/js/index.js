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

$(document).ready(function(){
	var cookiesAccepted = getCookie('displayCookieConsent');
	if(cookiesAccepted != 'y') {
		$('#cookie-notice').css('display', 'block');
		$('#cookie-notice-button').css('display', 'inline-block');
		$('#jumbo-container').css('margin-bottom', '30vh');
	}
	
	setInterval(function() {
		var border_opacity = (window.scrollY / 2) / window.innerHeight;
		var colour = Math.round(255 - ((window.scrollY / window.innerHeight) * (255 - 122)));
		
		if(border_opacity > 0.5) {
			border_opacity = 0.5;
		}
		
		if(colour < 122) {
			colour = 122;
		}
		
		$('.navbar-default').css('background-color', 'rgba(248, 248, 248, ' + window.scrollY / window.innerHeight + ')');
		$('.navbar-default').css('border-bottom', '1px solid rgba(127, 127, 127, ' + border_opacity + ')');
		$('#navbar-logo').css('color', 'rgb({0}, {1}, {2})'.format(colour, colour, colour));
		$('#myNavbar > ul > li > a').css('color', "rgb({0}, {1}, {2})".format(colour, colour, colour));
		$('#myNavbar > ul > li > a:hover').css('color', "#333");
	}, 40);
	
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
	
	socket.on('main-stats', function(data) {
		if(data.success) {
			console.log("Successfully received stats!");
			if(data.info.servers) {
				console.log("Amount of servers: " + data.info.servers);
			}
			
			if(data.info.max) {
				console.log("Total Memory: " + data.info.max);
			}
			
			if(data.info.used) {
				console.log("Used Memory: " + data.info.used);
			}
		} else {
			console.log("Failed to get stats");
            console.log("Reason: " + data.reason);
            console.log("ID: " + data.id);
		}
	});
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