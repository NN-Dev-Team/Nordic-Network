(function($) {
	$(window).load(function() {
		$('.testimonials').each(function() {
			var $self = $(this);
			var carousel = $('.testimonials-list', $self).carouFredSel({
				items: 1,
				direction: 'left',
				height: 'variable',
				auto: 10000,
				scroll: {
					fx: 'crossfade'
				},
				onCreate: function(data) {
					$('.testimonials-list', $self).css({
						overflow: 'visible'
					});
				},
				next: $('a.next', $self)
			});
		});
	});

	var changeDelay = 10000;

	$('.team-block').each(function() {
		var el = this;
		$('.team-item:not(:first-child)', el).hide();
		var interval = setInterval(team_change, changeDelay);
		function team_change() {
			var next = $('.team-item:visible', el).next('.team-item');
			if(next.length == 0) {
				next = $('.team-item:first-child', el);
			}
			$('.team-item:visible', el).stop().animate({ opacity : 'hide' }, function() {
				next.stop().animate({ opacity : 'show' });
			});
		}
		$(el).hover(
			function() {
				clearInterval(interval);
			},
			function() {
				interval = setInterval(team_change, changeDelay);
			}
		);
	});
})(jQuery);
