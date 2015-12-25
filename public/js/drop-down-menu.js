(function($) {
	$(function() {
/*		$('#header #site-navigation .menu-toggle').click(function () {
			$('#site-navigation ul.nav-menu:eq(0)').toggle();
		});*/

			$(window).resize(function() {
				if($('#header #site-navigation .menu-toggle').is(':visible')) {
					$('#site-navigation > ul').removeClass('main_menu');
					$('#site-navigation *').removeAttr('style');
					$('#site-navigation li:has(ul)').unbind('hover');
					$('#site-navigation li a').unbind('click');
					$('#site-navigation').addClass('dl-menuwrapper');
					$('#site-navigation > ul').addClass('dl-menu');
					$('#site-navigation > ul ul').addClass('dl-submenu');
					if($('#site-navigation').data('dlmenu')) {
						$('#site-navigation').data('dlmenu').destroyMenu();
					}
					$('#site-navigation').dlmenu({classin : 'dl-animate-in-1', classout : 'dl-animate-out-1'});
				} else {
					$('#site-navigation > ul').addClass('main_menu');
					if($('#site-navigation').data('dlmenu')) {
						$('#site-navigation').data('dlmenu').destroyMenu();
					}
					var menuHoverTimeout;
					if(!$.support.touch) {
						$("#site-navigation li").hover(
							function() {
								if($(this).is(':not(.hover)')) {
									$(this).siblings('li').removeClass('hover');
									$('#menu-home > li').find('li.hover').removeClass('hover');
									$(this).find(' > ul').addClass('effect-showed');
									$(this).removeClass('effect-showed');
									$(this).addClass('hover');
									if ($('> ul', this).size() > 0) {
										$("#site-navigation li:not(.hover) ul:visible").removeClass('horizontalFlip');
										var oldOuter = $('> ul', this).offset().left+ $('> ul', this).outerWidth(true);
										if( oldOuter > $(window).width()) {
											$('> ul', this).addClass('horizontalFlip');
											if($('> ul', this).offset().left < 0 && oldOuter-$(window).width() < -($('> ul', this).offset().left)) {
												$('> ul', this).removeClass('horizontalFlip');
											}
										}
									}
								}
								clearTimeout(menuHoverTimeout);
							},
							function() {
								if ($(this).hasClass('hover')) {
									clearTimeout(menuHoverTimeout);
									var self = $(this);
									menuHoverTimeout = setTimeout(function() {
										self.removeClass('hover');
										self.find('li').removeClass('hover');
										$('ul', self).removeClass('horizontalFlip');
									}, 300);
								} else {
									$(this).find(' > ul').stop(true, true).removeClass('effect-showed');
								}
							}
						);
					} else {
						var clickTimeout;
						$("#site-navigation li a").click(function(event) {
							if($.support.touch) {
								var self = $(this);
								if(self.next('ul').length) {
									event.preventDefault();
									clearTimeout(clickTimeout);
									clickTimeout = setTimeout(function() {
										window.location = self.attr('href');
									}, 5000);
								}
							}
						});
					}
				}
			}).trigger('resize');

	});
})(jQuery);
