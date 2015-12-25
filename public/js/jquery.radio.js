/*
 * jQuery Radio Buttons Styler 1.0.1 (22.09.20012)
 * http://dimox.name/styling-input-radio-using-jquery-css/
 *
 * Copyright (c) 2012 Dimox (http://dimox.name/)
 * Dual licensed under the MIT and GPL licenses.
 *
 */

(function($) {
	$.fn.radio = function() {
		$(this).css({position: 'absolute', left: '-9999px'}).each(function() {
			var input = $(this);
			if (input.next('span.radio').length < 1) {
				var span = $('<span class="radio" style="display:inline-block"></span>');
				input.after(span);
				if (input.is(':checked')) span.addClass('checked');
				if (input.is(':disabled')) span.addClass('disabled');
				// клик на псевдорадиокнопке
				span.click(function() {
					if (!$(this).is('.disabled')) {
						$('input[name="' + input.attr('name') + '"]').next().removeClass('checked');
						input.attr('checked', true).next().addClass('checked');
						input.trigger('click');
					}
				});
				// клик на label
				input.parent('label').add('label[for="' + input.attr('id') + '"]').click(function() {
					span.click();
				});
				// переключение стрелками
				input.change(function() {
					span.click();
				})
				.focus(function() {
					if (!span.is('.disabled')) span.addClass('focused');
				})
				.blur(function() {
					span.removeClass('focused');
				});
				// обновление при динамическом изменении
				input.live('refresh', function() {
					if (input.is(':checked')) {
						$('input[name="' + input.attr('name') + '"]').next().removeClass('checked');
						span.addClass('checked');
					}
					if (input.is(':disabled')) span.addClass('disabled');
						else span.removeClass('disabled');
				})
			}
		});
	}
})(jQuery)
