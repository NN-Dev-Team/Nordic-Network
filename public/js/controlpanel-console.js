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
	
	socket.on('console-query', function(data){
		$('#console textarea').text(data);
	});
	
	$("#consoleinput").on("keydown",function sendCMD(e) {
		if(e.keyCode == 13) {
			socket.emit('console-cmd', $(this).val());
			$(this).val("");
		}
	});
});

function changeTheme(state) {
	if(state == 0) {
		// Console
		$('#console').css('border-radius', 0);
		$('#console').css('background-color', "black");
		
		// Console buttons
		$('#cnslchangecolor').css('background-color', "black");
		$('#cnslchangecolor').css('color', "white");
		$('#cnslautochat').css('background-color', "black");
		$('#cnslautochat').css('color', "white");
		
		// Console IO
		$('#console').prepend($('#consoleinput'));
		$('#consoleinput').css('width', $('#console textarea').css('width'));
		$('#consoleinput').css('height', $('#console textarea').css('height'));
		$('#console textarea').remove();
		$('#consoleinput').css('color', "");
		$('#consoleinput').css('font-family', "");
		$('#consoleinput').css('font', "");
		$('#consoleinput').css('color', "");
		$('#consoleinput').css('border-bottom-left-radius', "");
		$('#consoleinput').css('border-bottom-right-radius', "");
		$('#consoleinput').css('border-bottom', "");
		$('#consoleinput').css('border-top', "");
		$('#consoleinput').css('border-left', "");
		$('#consoleinput').css('background-color', "black");
		$('#consoleinput').css('border', "none");
		$('#consoleinput').css('resize', "none");
		$('#consoleinput').css('border-top-left-radius', "10px");
		$('#consoleinput').css('float', "left");
		$('#consoleinput').css('border-right', "1px solid gray");
		
		// Console theme changer button
		$('#cnslchangecolor').attr('onclick', "changeTheme(1)");
		
		// Add theme cookie
		
	} else {
		// Console
		$('#console').css('border-radius', "10px");
		$('#console').css('background-color', "white");
		
		// Console buttons
		$('#cnslchangecolor').css('background-color', "white");
		$('#cnslchangecolor').css('color', "");
		$('#cnslautochat').css('background-color', "white");
		$('#cnslautochat').css('color', "");
		
		// Console IO
		$('#consoleinput').css('color', "");
		$('#consoleinput').css('border-top', "1px solid black");
		
		// Console theme changer button
		$('#cnslchangecolor').attr('onclick', "changeTheme(0)");
		
		// Remove theme cookie
		
	}
}