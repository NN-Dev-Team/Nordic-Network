function codeus_show_digram_line_element(queue, first) {
	var $skill = queue.shift();
	if ($skill == null || $skill == undefined) {
		setTimeout(function() {
			codeus_show_digram_line_element(queue, first);
		}, 1000);
		return;
	}
	
	if (first)
		var delay = 0;
	else
		var delay = 150;
	
	setTimeout(function() {
		var $progress = $skill.find('.skill-line div');
		var amount = parseFloat($progress.data('amount'));
		jQuery({countNum: 0}).animate({countNum: amount}, {
			duration: 1600,
			easing:'easeOutQuart',
			step: function() {
				var count = parseFloat(this.countNum);
				var pct = Math.ceil(count) + '%';
				$progress.width(count + '%');
				$skill.find('.skill-amount').html(pct);
			}
		});
		codeus_show_digram_line_element(queue, false);
	}, delay);
}

function codeus_start_line_digram(element) {
	jQuery(element).codeus_start_line_digram();
}

jQuery.fn.codeus_start_line_digram = function() {
	var $box = jQuery(this.get(0));
	if (!$box.hasClass('digram-line-box'))
		return;
	var diagram_lines_queue = [];
	jQuery('.skill-element', $box).each(function () {
		diagram_lines_queue.push(jQuery(this));
	});
	codeus_show_digram_line_element(diagram_lines_queue, true);
}

jQuery('.digram-line-box').each(function () {
	if (!jQuery(this).hasClass('lazy-loading-item') || !jQuery('body').hasClass('lazy-enabled'))
		jQuery(this).codeus_start_line_digram();
});
