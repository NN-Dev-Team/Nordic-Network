(function($) {
	$.fn.checkbox = function() {
		$(this).each(function() {
			var $el = $(this);
			$el.hide();
			$el.next('checkbox-sign').remove();
			var $checkbox = $('<span class="checkbox-sign" />').insertAfter($el);
			$checkbox.click(function() {
				$el.prop('checked', !($el.is(':checked'))).trigger('change');
			});
			$el.change(function() {
				if($el.is(':checked')) {
					$checkbox.addClass('checked');
				} else {
					$checkbox.removeClass('checked');
				}
			}).trigger('change');
		});
	}
})(jQuery);
