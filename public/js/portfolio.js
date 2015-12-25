(function($) {
	$(document).ready(function() {
		var prof_background_handler = false;
		
		function codeus_reset_portfolio_item(self) {
			$('.title-hover-color', self).stop(true, true).height(0);
			$('.overlay .p-icon', self).stop(true, true).css({'top': '-50%'});
			$('.overlay', self).stop(true, true).css({opacity: '1', display: 'none'});
			$('.title-inner-content', self).stop(true, true).removeClass('hover').css({top: 0, opacity: 1}).show();
		}
		
		$('.portfolio ul.thumbs li').hover(
			function(event) {
				var self = this;
				var hover_handler = $(self).data('hover-handler') || false;
				if (hover_handler)
					clearTimeout(hover_handler);
				hover_handler = setTimeout(function() {
					codeus_reset_portfolio_item(self);
				}, 500);
				codeus_reset_portfolio_item(this);
				$('.overlay', self).animate({ opacity: 'show'}, 200);
				$('.title-inner-content', this).animate({top: '100%'}, 150, function() {
					$('.title-hover-color', self).animate({height: '100%'}, 50);
					$(this).addClass('hover').css({
						top: '-200%',
						opacity: 'hide'
					});
					$('.title-inner', self).css({overflow: 'visible'});
					$(this).animate({
						top: 0,
						opacity: 'show'
					}, 150, function() {
						$('.title-inner', self).css({overflow: 'hidden'});
					});
					prof_background_handler = setTimeout(function() {
						if ($.browser.mozilla) {
							$('.overlay .p-icon', self).css({'top': '50%', '-moz-transition': 'all 150ms ease'});
						} else {
							$('.overlay .p-icon', self).animate({'top': '50%'}, 150);
						}
						if (hover_handler)
							clearTimeout(hover_handler);
					}, 50);
				});
			},
			function() {
				var self = this;
				if (prof_background_handler)
					clearTimeout(prof_background_handler);
				if ($.browser.mozilla) {
					$('.overlay .p-icon', self).css({'top': '-50%', '-moz-transition': 'all 150ms ease'});
				} else {
					$('.overlay .p-icon', self).stop(true, true).animate({'top': '-50%'}, 150);
				}
				setTimeout(function() {
					$('.title-inner', self).css({overflow: 'visible'});
					$('.title-inner-content', self).stop(true, true).css({
						top: 0,
					}).show().animate({
						top: '-200%',
						opacity: 'hide'
					}, 150, function() {
						$('.title-inner', self).css({overflow: 'hidden'});
						$('.title-hover-color', self).animate({height: '0'}, 50);
						$(this).removeClass('hover').css({
							top: '100%',
						}).show().animate({
							top: 0
						}, 150);
						$('.overlay', self).stop(true, true).animate({ opacity: 'hide'}, 200);
					});
				}, 70);
			}
		);
		$('.portfolio .share-block').hide();
		$('.portfolio').on('click', '.share-block-toggle', function() {
			$(this).next('.share-block').animate({height: 'toggle'});
			$(this).toggleClass('active');
		});
		$('.portfolio').on('mouseleave', '.share-block',function() {
			$(this).animate({height: 'hide'});
			$(this).prev('.share-block-toggle').removeClass('active');
		});
		$(window).load(function() {
			$('.block.portfolio .carousel').each(function() {
				var el = $('ul', this).get(0);
				var temp = $('<div/>');
				var _animating = false;
				$('li',el).appendTo(temp);$(el).css('margin', 0).html('');$('li',temp).appendTo(el).css('margin-bottom', 0);

				var navigation = $('<div class="navigation"/>').insertAfter(this);
				var prev = $('<a href="javascript:void(0);" class="prev">Prev</a>')
					.appendTo(navigation);
				var next = $('<a href="javascript:void(0);" class="next">Next</a>')
					.appendTo(navigation);

				$(el).juraSlider({
					element: 'li',
					margin: 30,
					prevButton: prev,
					nextButton: next
				});
			});
		});
		
		$('.portfolio:not(.block) .galleriffic').each(function() {
			var portfolio = this;
			
			var count = $('ul.thumbs li', portfolio).size();
			var count_per_page = $(portfolio).data('count');
			var pages_count = Math.ceil(count / count_per_page);
			var current_page = 1;
			$(portfolio).data('current-page', current_page);
			
			if (pages_count > 1) {
				var paginator = '<div class="pagination">';
				paginator += '<a href="#Prev" style="display: none;" class="prev">Prev</a>';
				for (var i = 0; i < pages_count; i++)
					paginator += '<a href="#' + (i + 1) + '">' + (i + 1) +'</a>';
				paginator += '<a href="#Next" class="next">Next</a>';
				paginator += '</div>';
				$(portfolio).after(paginator);
				
				
				$(portfolio).parent().find('.pagination a[href="#' + current_page + '"]').addClass('current');
				
				$(portfolio).parent().find('.pagination a').click(function() {
					var current_page = parseInt($(portfolio).data('current-page'));
					var next_page = $(this).attr('href').replace('#', '');
					if (current_page == next_page)
						return false;
					if (next_page == 'Next')
						next_page = current_page + 1;
					if (next_page == 'Prev')
						next_page = current_page - 1;
					next_page = parseInt(next_page);
					if (next_page > pages_count)
						next_page = pages_count;
					if (next_page < 1)
						next_page = 1;
					$(portfolio).data('current-page', next_page);
					$(this).siblings().removeClass('current');
					$(this).parent().find('a[href="#' + next_page + '"]').addClass('current');
					if (next_page > 1)
						$(this).parent().find('a[href="#Prev"]').show();
					else
						$(this).parent().find('a[href="#Prev"]').hide();
					if (next_page < pages_count)
						$(this).parent().find('a[href="#Next"]').show();
					else
						$(this).parent().find('a[href="#Next"]').hide();
					
					$('ul.thumbs', portfolio).animate({opacity: 0}, 300, function() {
						$(this).find('li.paginator-page-' + current_page).hide();
						$(this).find('li.paginator-page-' + next_page).css({
							display: 'inline-block',
							opacity: 1
						});
						$('ul.thumbs', portfolio).animate({opacity: 1}, 300);
						$("html, body").animate({ scrollTop: 0 }, 600);
					});
					
					return false;
				});
			}
			
			$('ul.thumbs li', portfolio).each(function(i) {
				var page = Math.ceil((i+1) / count_per_page);
				$(this).addClass('paginator-page-' + page);
			});
			$('ul.thumbs li.paginator-page-' + current_page, portfolio).css({
				display: 'inline-block',
				opacity: 1
			});
		});
		
		$('.portfolio:not(.block) .rubrics').each(function() {
			var portfolio = this;
			
			var count = $('ul.thumbs li', portfolio).size();
			var count_per_page = $(portfolio).data('count');
			var pages_count = Math.ceil(count / count_per_page);
			var current_page = 1;
			$(portfolio).data('current-page', current_page);
			
			if (pages_count > 1) {
				var paginator = '<div class="pagination">';
				paginator += '<a class="prev" href="#Prev" style="display: none;">Prev</a>';
				for (var i = 0; i < pages_count; i++)
					paginator += '<a href="#' + (i + 1) + '">' + (i + 1) +'</a>';
				paginator += '<a class="next" href="#Next">Next</a>';
				paginator += '</div>';
				$(portfolio).after(paginator);
				
				$('ul.filter li:first', portfolio).addClass('active');
				$('ul.filter li', portfolio).each(function() {
					var filter = $(this).attr('data-filter') || '';
					filter += ' paginator-page-' + current_page;
					$(this).attr('data-filter', filter);
				});
				
				
				$(portfolio).parent().find('.pagination a[href="#' + current_page + '"]').addClass('current');
				
				$(portfolio).parent().find('.pagination a').click(function() {
					var current_page = parseInt($(portfolio).data('current-page'));
					var next_page = $(this).attr('href').replace('#', '');
					if (current_page == next_page)
						return false;
					if (next_page == 'Next')
						next_page = current_page + 1;
					if (next_page == 'Prev')
						next_page = current_page - 1;
					next_page = parseInt(next_page);
					if (next_page > pages_count)
						next_page = pages_count;
					if (next_page < 1)
						next_page = 1;
					$(portfolio).data('current-page', next_page);
					$(this).siblings().removeClass('current');
					$(this).parent().find('a[href="#' + next_page + '"]').addClass('current');
					if (next_page > 1)
						$(this).parent().find('a[href="#Prev"]').show();
					else
						$(this).parent().find('a[href="#Prev"]').hide();
					if (next_page < pages_count)
						$(this).parent().find('a[href="#Next"]').show();
					else
						$(this).parent().find('a[href="#Next"]').hide();
					
					$('ul.thumbs', portfolio).animate({opacity: 0}, 300, function() {
						$(this).find('li.paginator-page-' + current_page).hide();
						$(this).find('li.paginator-page-' + next_page).css({
							display: 'inline-block',
							opacity: 1
						});
						$('ul.filter li.active', portfolio).removeClass('active');
						$('ul.filter li:first', portfolio).addClass('active');
						$('ul.filter li', portfolio).each(function() {
							var filter = $(this).attr('data-filter').replace('paginator-page-' + current_page, '');
							filter += 'paginator-page-' + next_page;
							$(this).attr('data-filter', filter);
						});
						$('ul.thumbs', portfolio).animate({opacity: 1}, 300);
						$("html, body").animate({ scrollTop: 0 }, 600);
					});
					
					return false;
				});
			}
			
			$('ul.thumbs li', portfolio).each(function(i) {
				var page = Math.ceil((i+1) / count_per_page);
				$(this).addClass('paginator-page-' + page);
			});
			
			$('ul.thumbs li .info a', portfolio).click(function() {
				var slug = $(this).data('slug') || '';
				if (!slug)
					return false;
				$('ul.filter li.mix-filter', portfolio).each(function() {
					var filter_slugs = $(this).data('filter') || '';
					var slugs = filter_slugs.split(' ');
					for (var i = 0; i < slugs.length; i++)
						slugs[i] = $.trim(slugs[i]);
					if ($.inArray(slug, slugs) != -1) {
						$(this).click();
						return false;
					}
				});
				return false;
			});
			
			$(portfolio).data('is_mix_animating', 0);
			$('ul.thumbs', portfolio).mixitup({
				filterSelector: '.mix-filter',
				targetSelector: 'li',
				effects: ['fade'],
				showOnLoad: 'paginator-page-' + current_page,
				filterLogic: 'and',
				onMixStart: function() {
					$(portfolio).data('is_mix_animating', 1);
				},
				onMixEnd: function() {
					$(portfolio).data('is_mix_animating', 0);
				}
			});
		});

		jQuery.fn.sortEls = function sortEls(attr) {
			$('> *['+attr+']', this).sort(dec_sort).appendTo(this);
			function dec_sort(a, b){ return parseInt($(b).attr(attr)) < parseInt($(a).attr(attr)) ? 1 : -1; }
		}

	});

})(jQuery);
