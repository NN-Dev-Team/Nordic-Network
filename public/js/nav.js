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
});