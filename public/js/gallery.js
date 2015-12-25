var gallery_hover_timeout = false;
var gallery_navigation_hover = false;

(function($) {
	codeus_init_gallery = function() {
				var gallery = this;
				var num = 6;
				if($(this).hasClass('small')) {
					num = 4;
				}
				var thumbsEl = $('ul.thumbs', this).get(0);
				var previewEl = $('ul.preview', this).get(0);
				var temp = $('<div/>');
				$('li:first-child',thumbsEl).addClass('first');
				$('li:last-child',thumbsEl).addClass('last');
				$('li:first-child',previewEl).addClass('first');
				$('li:last-child',previewEl).addClass('last');
				$('li',thumbsEl).appendTo(temp);$(thumbsEl).css('margin', 0).html('');$('li',temp).appendTo(thumbsEl);
				$('li',previewEl).appendTo(temp);$(previewEl).css('margin', 0).html('');$('li',temp).appendTo(previewEl);
				$('li',thumbsEl).each(function() {
					$(this).attr('data-num', $('li',thumbsEl).index($(this)));
				});
				$('li',previewEl).each(function() {
					$(this).attr('data-num', $('li',previewEl).index($(this)));
				});
				$('li',thumbsEl).first().addClass('selected');
				$(thumbsEl).carouFredSel({
					width: '100%',
					circular: false,
					infinite: false,
					align: 'center',
					auto: false,
					scroll : {
						easing : 'swing',
						duration : 1000,
						onBefore : function(data){
							$(thumbsEl).closest('.thumbs_wrapper').find('.navigation').hide();
						},
						onAfter: function(data) {
							$(thumbsEl).closest('.thumbs_wrapper').find('.navigation').show();
							if (data.items.visible.index($('li.last',thumbsEl))!=-1) $(thumbsEl).closest('.thumbs_wrapper').find('.navigation').children('.next').addClass('disable');
							else $(thumbsEl).closest('.thumbs_wrapper').find('.navigation').children('.next').removeClass('disable');

							if (data.items.visible.index($('li.first',thumbsEl))!=-1) $(thumbsEl).closest('.thumbs_wrapper').find('.navigation').children('.prev').addClass('disable');
							else $(thumbsEl).closest('.thumbs_wrapper').find('.navigation').children('.prev').removeClass('disable');
						}
					},
					onCreate: function(data) {
						if(data.items.length < 2) {
							$(thumbsEl).closest('.thumbs_wrapper').hide();
						}
						var el_width = $('li:first',thumbsEl).width();
						var box_width = $(thumbsEl).parent().width();

						var disable = '';
						if (parseInt(box_width/el_width) >= $('li',thumbsEl).length) disable='disable';
						$(thumbsEl).closest('.thumbs_wrapper').find('.navigation').remove();
						var navigationThumbs = $('<div class="navigation"/>');
						$(thumbsEl).closest('.thumbs_wrapper').append(navigationThumbs);
						$('<a href="javascript:void(0);" class="prev disable">Prev</a>')
							.appendTo(navigationThumbs)
							.click(function() {
								$(thumbsEl).trigger('prevPage');
							});
						$('<a href="javascript:void(0);" class="next '+disable+'">Next</a>')
							.appendTo(navigationThumbs)
							.click(function() {
								$(thumbsEl).trigger('nextPage');
							});
					}

				});
				//$('li', previewEl).width($(previewEl).width());
				$(previewEl).carouFredSel({
					responsive: true,
					width: '100%',
					circular: false,
					infinite: false,
					align: 'center',
					auto: false,
					items : {visible: 1},
					scroll : {
						items : 1,
						easing : 'swing',
						duration : 1000,
						onBefore : function(data){
							var current = data.items.visible.get(0);
							var active = $('li[data-num="'+$(current).attr('data-num')+'"]', thumbsEl).get(0);
							if($(thumbsEl).triggerHandler('currentVisible').index(active) == -1) {
								$(thumbsEl).trigger('slideTo', active);
							}
							$('li.selected',thumbsEl).removeClass('selected');
						},
						onAfter: function(data) {
							var current = data.items.visible.get(0);
							var active = $('li[data-num="'+$(current).attr('data-num')+'"]', thumbsEl).get(0);
							$(active).addClass('selected');
							$(window).on('resize', function(){
								$(previewEl).height($(current).height());
								$(previewEl).parent().height($(current).height());
							}).trigger('resize');

							if (data.items.visible.index($('li.last',previewEl))!=-1) $(previewEl).siblings('.navigation').children('.next').addClass('disable');
							else $(previewEl).siblings('.navigation').children('.next').removeClass('disable');

							if (data.items.visible.index($('li.first',previewEl))!=-1) $(previewEl).siblings('.navigation').children('.prev').addClass('disable');
							else $(previewEl).siblings('.navigation').children('.prev').removeClass('disable');
						}
					},
					onCreate: function(data) {
						$(window).on('resize', function(){
							$(previewEl).height($('> li:first-child', previewEl).height());
							$(previewEl).parent().height($(data.items[0]).height());
						}).trigger('resize');

						var el_width = $('li:first',thumbsEl).width();
						var box_width = $(thumbsEl).parent().width();

						var disable = '';
						//if (parseInt(box_width/el_width) >= $('li',thumbsEl).length) disable='disable';
						if($('li',previewEl).length < 2) {
							disable='disable';
						}
						var navigationPreview = $('<div class="navigation preview-navigation"/>').insertAfter(previewEl);
						$('<a href="javascript:void(0);" class="prev disable">Prev</a>')
							.appendTo(navigationPreview)
							.click(function() {
								$(previewEl).trigger('prevPage');
							});
						$('<a href="javascript:void(0);" class="next '+disable+'">Next</a>')
							.appendTo(navigationPreview)
							.click(function() {
								$(previewEl).trigger('nextPage');
							});
						$('li a',thumbsEl).click(function() {
							$(previewEl).trigger('slideTo', $('li[data-num="'+$(this).parent('li').attr('data-num')+'"]', previewEl).get(0));
							return false;
						});

					}
				});
				
				$('li a',thumbsEl).click(function() {
					$(this).parent().siblings('li').removeClass('selected');
					$(this).parent().addClass('selected');
					return false;
				});
				
				$('.preview-navigation a', gallery).unbind('hover');
				$('.preview-navigation a', gallery).hover(
					function() {
						if (gallery_hover_timeout)
							clearTimeout(gallery_hover_timeout);
					},
					function() {
						var self = this;
						gallery_navigation_hover = setTimeout(function() {
							$(self).parent().siblings('ul.preview').find('li.hover').trigger('mouseleave');
						}, 50);
					}
				);

				$('ul.preview li', gallery).unbind('hover');
				$('ul.preview li', gallery).hover(
						function() {
							var self = $(this);
							
							if (gallery_navigation_hover)
								clearTimeout(gallery_navigation_hover);
							if ($(self).hasClass('hover'))
								return;
							
							$('.overlay .p-icon', this).stop(true, true).css({'top': '-50%'});
							$('.overlay', this).stop(true, true).animate({ opacity: 'show' }, 200);
							prof_background_handler = setTimeout(function() {
								if ($.browser.mozilla) {
									$('.overlay .p-icon', self).css({'top': '50%', '-moz-transition': 'all 150ms ease'});
								} else {
									$('.overlay .p-icon', self).animate({'top': '50%'}, 150);
								}
								$(self).addClass('hover');
								$(self).parents('ul').siblings('.navigation').find('a').not('.disable').fadeIn(400);
							}, 100);
						},
						function() {
							var self = $(this);
							gallery_hover_timeout = setTimeout(function() {
								if (prof_background_handler)
									clearTimeout(prof_background_handler);
								if ($.browser.mozilla) {
									$('.overlay .p-icon', self).css({'top': '-50%', '-moz-transition': 'all 150ms ease'});
								} else {
									$('.overlay .p-icon', self).stop(true, true).animate({'top': '-50%'}, 150);
								}
								$(self).parents('ul').siblings('.navigation').find('a').fadeOut(400);
								$(self).removeClass('hover');
								prof_overlay_handler = setTimeout(function() {
									$('.overlay', self).animate({ opacity: 'hide' });
								}, 100);
							}, 50);
						}
				);
	}

	$('.tabs').on('noscript-loaded', function() {
		$('.tab_wrapper:visible', this).each(function() {
			$('.gallery', this).trigger('gallery-init');
		});
	});
	
	$('.accordion').on('noscript-loaded', function() {
		$('.ui-accordion-content:visible', this).each(function() {
			$('.gallery', this).trigger('gallery-init');
		});
	});
		
	$('.gallery').each(function() {
		$(this).on('gallery-init', codeus_init_gallery);
		if ($(this).closest('.tabs').size() > 0)
			return;
		$(this).on('noscript-loaded', codeus_init_gallery);
	});
	
	$(window).load(function() {
		$('.gallery-three-columns ul.preview li, .gallery-four-columns ul.preview li').hover(
					function() {
						var self = $(this);
						
						if (gallery_navigation_hover)
							clearTimeout(gallery_navigation_hover);
						
						$('.overlay .p-icon', this).stop(true, true).css({'top': '-50%'});
						$('.overlay', this).stop(true, true).animate({ opacity: 'show' }, 200);
						prof_background_handler = setTimeout(function() {
							if ($.browser.mozilla) {
								$('.overlay .p-icon', self).css({'top': '50%', '-moz-transition': 'all 150ms ease'});
							} else {
								$('.overlay .p-icon', self).animate({'top': '50%'}, 150);
							}
						}, 100);
					},
					function() {
						var self = $(this);
						if (prof_background_handler)
							clearTimeout(prof_background_handler);
						if ($.browser.mozilla) {
							$('.overlay .p-icon', self).css({'top': '-50%', '-moz-transition': 'all 150ms ease'});
						} else {
							$('.overlay .p-icon', self).stop(true, true).animate({'top': '-50%'}, 150);
						}
						prof_overlay_handler = setTimeout(function() {
							$('.overlay', self).animate({ opacity: 'hide' });
						}, 100);
					}
			);
	});

})(jQuery);
