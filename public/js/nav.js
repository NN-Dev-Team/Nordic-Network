"use strict";

$(window).bind("load", function() {
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
});