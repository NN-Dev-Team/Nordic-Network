(function($) {
	$('a.fancy').fancybox();
    $('a.fancy_gallery').fancybox({
        helpers : {
            title: {
                type: 'over'
            }
        },
        wrapCSS: 'slideinfo',
        beforeLoad: function() {
            var clone = $(this.element).children('.slide-info').clone();

            if (clone.length) {
                this.title = clone.html();
            }
        }
    });

	$('.youtube a:not(.share-block-toggle, .share-block a), .vimeo a:not(.share-block-toggle, .share-block a)').fancybox({
		type: 'iframe'
	});
	$('.self_video a:not(.share-block-toggle, .share-block a)').fancybox({
		width: '80%',
		height: '80%',
		autoSize: false,
		content: '<div id="fancybox-video"></div>',
		afterShow: function() {
			if(this.element.next('.caption').next('.videoblock').html() != '') {
				this.inner.html(this.element.next('.caption').next('.videoblock').html());
			} else {
				jwplayer('fancybox-video').setup({
					file: this.href,
					width: '100%',
					height: '100%',
					autostart: true
				});
			}
		},
		beforeClose: function() {
			if(this.element.next('.videoblock').html() == '') {
				jwplayer('fancybox-video').remove();
			}
		}
	});
})(jQuery);
