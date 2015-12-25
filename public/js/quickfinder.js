(function($) {
	var ua = navigator.userAgent.toLowerCase(),
	platform = navigator.platform.toLowerCase(),
	UA = ua.match(/(opera|ie|firefox|chrome|trident|crios|version)[\s\/:]([\w\d\.]+)?.*?(safari|(?:rv[\s\/:]|version[\s\/:])([\w\d\.]+)|$)/) || [null, 'unknown', 0],
	mode = UA[1] == 'ie' && document.documentMode;

	if (UA[1] == 'trident'){
		UA[1] = 'ie';
		if (UA[4]) UA[2] = UA[4];
	} else if (UA[1] == 'crios'){
		UA[1] = 'chrome';
	}
	
	var Browser = {
		name: (UA[1] == 'version') ? UA[3] : UA[1],
		version: parseFloat((UA[1] == 'opera' && UA[4]) ? UA[4] : UA[2]),
		Platform: {
			name: ua.match(/ip(?:ad|od|hone)/) ? 'ios' : (ua.match(/(?:webos|android)/) || platform.match(/mac|win|linux/) || ['other'])[0]
		},
	};
	
	$(function() {
		var is_chrome_mobile = Browser.name == 'chrome' && (Browser.Platform.name == 'ios' || Browser.Platform.name == 'android' ||
															Browser.Platform.name == 'webos');
		if(!window.opera && $.support.opacity && !is_chrome_mobile && !(Browser.Platform.name == 'linux' && Browser.name == 'chrome' && Browser.version >= 37)) {
			$('.quickfinder ul li .image:not(.thumb), .news_list .news_item .date .day, .blog_list li .date-day').each(function() {
				$(this).wrapInner('<span></span>');
				var $self = jQuery(this).find('span');
				var textShadow = buildQuickfinderTextShadow(this, jQuery(this).css('backgroundColor'));
				$self.css({
					'textShadow': textShadow
				});
			});
		}
		
		jQuery('.quickfinder ul li .image:not(.thumb)').each(function() {
			var font_color = jQuery(this).css('color');
			var background_color = jQuery(this).css('background-color');
			var shadow_color = convertColor(background_color);
			var old_shadow = $('>span', this).css('text-shadow');
			
			var quick_handler = false;
			
			jQuery(this).hover(
				function() {
					if (quick_handler)
						clearTimeout(quick_handler);
					jQuery(this).find('> span').css({
						textShadow: 'none'
					});
					jQuery(this).stop(true, true).animate({
						backgroundColor: font_color,
						color: shadow_color,
					}, 200);
				},
				function() {
					var self = this;
					jQuery(this).stop(true, true).animate({
						backgroundColor: background_color,
						color: font_color,
					}, 200, function() {
					});
					quick_handler = setTimeout(function() {
						jQuery(self).find('> span').css({
							textShadow: old_shadow
						});
					}, 200);
				}
			);
		});
	});
})(jQuery);
