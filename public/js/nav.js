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

function addCookie(name, value, time) {
    var day = new Date();
    day.setTime(day.getTime() + (time*24*60*60*1000));
    var expires = "expires="+day.toUTCString();
    document.cookie = name + "=" + value + "; " + expires + "; path=/";
}

function delCookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function getValFromStr(str, c) {
	var ch = 0;
	
	for( ; ch < str.length; ch++) {
		if(str[ch] == c) {
			break;
		}
	}
	
	var val = "";
	
	for( ; ch < str.length; ch++) {
		if($.isNumeric(str[ch]) || str[ch] == c || str[ch] == ".") {
			val += str[ch];
		} else {
			break;
		}
	}
	
	return val;
}

function convertCurrency(obj) {
	var str = $(obj).html();
	
	if(str != "FREE") {
		var c = getCookie("currency");
		
		if(c == 0) {
			var old_val_str = getValFromStr(str, "$");
			var old_val = old_val_str.substring(1);
			
			var new_val = Math.round((old_val / 1.2) * 4) / 4;
			var new_html = str.replace(old_val_str, "£" + new_val);
			
			$(obj).html(new_html);
		} else if(c == 1) {
			var old_val_str = getValFromStr(str, "£");
			var old_val = old_val_str.substring(1);
			
			var new_val = Math.round((old_val * 1.2) * 4) / 4;
			var new_html = str.replace(old_val_str, "$" + new_val);
			
			$(obj).html(new_html);
		}
	}
	
	$(obj).css('visibility', 'visible');
}

$(document).ready(function() {
	 $.get("../properties.txt", function(data) {
        values = data.split("\n");
		
		host = values[0].trim();
		port = Number(values[1]);
	}).fail(function() {
		swal("Failed to get server IP", "Please contact our admins about this error so we can fix it as soon as possible!", "error");
	}).done(function() {
		var socket = io('http://' + host + ":" + port);
		if(socket.disconnected) {
			swal("Unable to connect to server.", "It seems our game servers are down.\nPlease be patient while we work on a fix!", "error");
		}
		
		$('button #logout').click(function(){
			socket.emit('logout', {"id": getCookie("user_id"), "session": getCookie("session")});
			delCookie('session');
			return false;
		});
		
		socket.on('logout-complete', function(data) {
			if(data.success) {
				delCookie('session');
			} else {
				swal("Failed to logout.", "Somehow?!", "error");
			}
		});
    }, 'text');
});

function changeCurrency(c) {
	if(c == 0) {
		$('#changeCurrency img').attr("src", "/pics/icons/uk-icon.png");
		$('#changeCurrency img').css("visibility", "visible");
		
		addCookie("currency", 0, 1024);
		
		for(var i = 0; i < $('.currency').length; i++) {
			convertCurrency($('.currency')[i]);
		}
	} else if(c == 1) {
		$('#changeCurrency img').attr("src", "/pics/icons/us-icon.png");
		$('#changeCurrency img').css("visibility", "visible");
		
		addCookie("currency", 1, 1024);
		
		for(var i = 0; i < $('.currency').length; i++) {
			convertCurrency($('.currency')[i]);
		}
	}
}
