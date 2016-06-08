$(document).ready(function(){
	var cookiesAccepted = getCookie('displayCookieConsent');
	if(cookiesAccepted != 'y') {
		$('#cookie-notice').css('display', 'block');
		$('#cookie-notice-button').css('display', 'block');
	}
});

function acceptCookies() {
	addCookie('displayCookieConsent', 'y', 256);
	$('#cookie-notice').css('display', 'none');
	$('#cookie-notice-button').css('display', 'none');
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