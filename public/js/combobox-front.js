(function($) {
	$.fn.combobox = function() {
		$(this).each(function() {
			var $el = $(this);
			$el.insertBefore($el.parent('.combobox-wrapper'));
			$el.next('.combobox-wrapper').remove();
			var $comboWrap = $('<div class="combobox-wrapper" />').insertAfter($el);
			var $button = $('<span class="combobox-button" />').appendTo($comboWrap);
			$el.appendTo($comboWrap);
		});
	}
})(jQuery);
