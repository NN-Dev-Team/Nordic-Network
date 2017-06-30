var currencies = ["£", "$"];
const poundTo$ = 1.25; // £1 = $1.25

function addCookie(name, value, time) {
    var day = new Date();
    day.setTime(day.getTime() + (time*24*60*60*1000));
    var expires = "expires="+day.toUTCString();
    document.cookie = name + "=" + value + "; " + expires + "; path=/";
}

function getCurrency(str) {
	for(var c = 0; c < str.length; c++) {
		for(var cu = 0; cu < currencies.length; cu++) {
			if(str[c] == currencies[cu]) {
				return c;
			}
		}
	}
}

function getValFromStr(str, c) {
	var val = str[c];
	
	for(c++; c < str.length; c++) {
		if($.isNumeric(str[c]) || str[c] == ".") {
			val += str[c];
		} else {
			break;
		}
	}
	
	return val;
}

function toCurrency(val, c) {
	if(c == 0) {
		return Math.round((val / poundTo$) * 4) / 4;
	} else if(c == 1) {
		return Math.round((val * poundTo$) * 4) / 4;
	}
}

function convertCurrency(obj) {
	var str = $(obj).html();
	
	if(str != "FREE") {
		var c = getCookie("currency");
		var c_old = getCurrency(str);
		
		if(currencies[c] != str[c_old]) {
			var old_val_str = getValFromStr(str, c_old);
			var old_val = old_val_str.substring(1);
			
			var new_val = toCurrency(old_val, c);
			var new_html = str.replace(old_val_str, currencies[c] + new_val);
			
			$(obj).html(new_html);
		}
	}
	
	$(obj).css('visibility', 'visible');
}

function changeCurrency(c) {
	addCookie("currency", c, 1024);
		
	for(var i = 0; i < $('.currency').length; i++) {
		convertCurrency($('.currency')[i]);
	}
}