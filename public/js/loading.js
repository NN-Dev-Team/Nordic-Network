var counter = 0;
(function($) {
	function trigger_loading_finish($box, loading) {
		if ($(loading).size() > 0)
			$(loading).animate({opacity: 'hide'}, function() {
				$('.noscript', $box).removeClass('noscript').data('is-loaded', true).trigger('noscript-loaded');
				$('.loading', $box).remove();
				$box.removeClass('noscript').data('is-loaded', true);
				$(loading).remove();
				$box.trigger('noscript-loaded');
			});
		else
			$box.trigger('noscript-loaded');
	}
	
	function image_loaded($box, loading) {
		var is_loaded = $box.data('is-loaded') || false;
		//if (is_loaded)
		//	return false;
		var count = parseInt($box.attr('data-load-count') || 0);
		if (isNaN(count))
			count = 1;
		count -= 1;
		$box.attr('data-load-count', count);
		if (count <= 0) {
			trigger_loading_finish($box, loading);
		}
	}
	
	$('.noscript + .loading').each(function() {
		var loading = this;
		var $box = $(this).prev('.noscript:first');
		if ($box.parents('.noscript').size() > 0) {
			return;
		}
		
		var images_count = $('img', $box).size();
		//console.log(images_count);
		if (images_count > 0) {
			$box.attr('data-load-count', images_count);
			$('img', $box).each(function() {
				var url = $(this).attr('src') || '';
				if (url == '') {
					image_loaded($box, loading);
					return;
				}
				var img = new Image();
				img.onload = function() {
					counter += 1;
					//console.log(counter);
					image_loaded($box, loading);
				};
				img.onerror = function() {
					counter += 1;
					//console.log('error - ' + counter);
					image_loaded($box, loading);
				};
				img.src = url;
			});
		} else {
			trigger_loading_finish($box, loading);
		}
	});
	
	$(window).load(function() {
		//console.log('ready');
		
		$('.noscript + .loading').each(function() {
			var loading = this;
			var $box = $(this).prev('.noscript:first');
			if ($box.parents('.noscript').size() > 0) {
				return;
			}
			trigger_loading_finish($box, loading);
		});
				
		//$('.accordion:not(.closed)').accordion('option', 'active', false);
		//$('.accordion:not(.closed)').accordion('option', 'active', 0);
	});
})(jQuery);
