function convertColor(rgb){
	if(rgb.indexOf('rgb') != -1) {
		rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
		rgb[1] -= (rgb[1] > 20 ? 20 : rgb[1]);
		rgb[2] -= (rgb[2] > 20 ? 20 : rgb[2]);
		rgb[3] -= (rgb[3] > 20 ? 20 : rgb[3]);
		return 'rgb('+rgb[1]+','+rgb[2]+','+rgb[3]+')';
	} else {
		return rgb;
	}
}

function buildQuickfinderTextShadow(element, color) {
	var $self = jQuery(element).find('span');
	var length = $self.height();
	var shadowColor = convertColor(color);
	var textShadow = '0px 0px 0 '+shadowColor;
	for(i = 1; i < length; i++) {
		textShadow += ','+i+'px '+i+'px 0 '+shadowColor;
	}
	return textShadow;
}

jQuery(document).ready(function() {
	jQuery('ul.jobs li').hover(
		function() {
			jQuery(this).animate({
				left: -15
			}, 150);
		},
		function() {
			jQuery(this).animate({
				left: 0
			}, 150);
		}
	);
});

function codeus_fix_header_height(timeout) {
	var func = function() {
		jQuery('.header-fixed-wrapper').height(jQuery('#header').outerHeight());
	};
	if (timeout > 0)
		setTimeout(func, timeout);
	else
		func();
	
}

function codeus_header_fixed_init() {
	jQuery('#header').addClass('fixed-init');
	
	jQuery(window).resize(function() {
		if (jQuery('#header').hasClass('header-first-init'))
			codeus_fix_header_height(300);
	});
	
	jQuery(window).scroll(function() {
		if (jQuery(window).scrollTop() > 0 && !jQuery('#header').hasClass('header-fixed-inited')) {
			codeus_fix_header_height(0);
			jQuery('#header').addClass('header-fixed-inited').addClass('header-first-init');
			jQuery('#header').css({
				paddingTop: 20
			}).animate({
				paddingTop: 0
			}, 600);
			jQuery('#header .central-wrapper').stop(true, true).animate({
				paddingBottom: 13
			}, 600);
			jQuery('#header .header-fixed-logo').stop(true, true);
			jQuery('#header .site-title > a > img').not('.header-fixed-logo').stop(true, true).css({display: 'inline', visibility: 'visible'}).fadeOut(300, function() {
				jQuery('#header').addClass('header-fixed');
				jQuery('#header .header-fixed-logo').fadeIn(300);
			});
		} else if (jQuery(window).scrollTop() == 0 && jQuery('#header').hasClass('header-fixed-inited')) {
			jQuery('#header').removeClass('header-fixed-inited');
			jQuery('#header .central-wrapper').stop(true, true).animate({
				paddingBottom: 20
			}, 600);
			jQuery('#header .site-title > a > img').not('.header-fixed-logo').stop(true, true);
			jQuery('#header .site-title > a > img.header-fixed-logo').stop(true, true).fadeOut(300, function() {
				jQuery('#header').removeClass('header-fixed');
				jQuery('#header .site-title > a > img').not('.header-fixed-logo').fadeIn(300);
			});
		}
	});
	
	if (jQuery(window).scrollTop() > 0)
		jQuery(window).trigger('scroll');
}



jQuery(document).ready(function() {
	if(jQuery('body').hasClass('lazy-enabled')) {
		if(!jQuery.support.opacity) {
			jQuery('body').removeClass('lazy-enabled')
		} else {
			jQuery('.widget_text, .widget_black_studio_tinymce').addClass('lazy-loading').data('ll-item-delay', '0').wrapInner('<div class="lazy-loading-item" data-ll-effect="fading"></div>');
			jQuery('ul.jobs').addClass('lazy-loading').data('ll-item-delay', '200');
			jQuery('li', 'ul.jobs').addClass('lazy-loading-item').data('ll-effect', 'slide-right');
			if(jQuery(window).width() > 800) {
				jQuery.lazyLoading();
				
			}
		}
	}
});

jQuery(document).ready(function() {
	if(jQuery(window).width() > 800)
		codeus_header_fixed_init();
});

function fix_pricing_table_title() {
	jQuery('.pricing-table').each(function() {
		var $highlighted = jQuery('.pricing-column.highlighted', this);
		if ($highlighted.size() == 0)
			return;
		var height = jQuery('.pricing-title', $highlighted).outerHeight();
		jQuery('.pricing-column', this).not('.highlighted').each(function() {
			var diff = height - jQuery('.pricing-title', this).outerHeight();
			if (diff < 0)
				diff = 0;
			jQuery(this).css({
				paddingTop: diff
			});
		});
	});
}

function update_price_order_code(elem) {
	if ( jQuery( elem ).data( 'order_button_text' ) ) {
		jQuery( '#place_order' ).html( jQuery( elem ).data( 'order_button_text' ) );
	} else {
		jQuery( '#place_order' ).html( jQuery( '#place_order' ).data( 'value' ) );
	} 
}

(function($) {
	fix_pricing_table_title();
	$('.woocommerce-checkout .form-row #createaccount, .woocommerce-checkout #ship-to-different-address .input-checkbox, .woocommerce .login .form-row #rememberme').checkbox();
	$('body').bind('updated_checkout', function() {
		$('.woocommerce .checkout #payment .payment_methods li .input-radio').radio();
		$('.woocommerce .checkout #payment .payment_methods li .input-radio').click(function() {
			update_price_order_code(this);
		});
		update_price_order_code($('.woocommerce .checkout #payment .payment_methods li .input-radio:checked'));
	});
	
	jQuery('.woocommerce-button-next-step').click(function() {
		var tab_id = $(this).closest('.tab_wrapper').attr('id');
		$(this).closest('.tabs').find('.tabs-nav li[aria-controls="' + tab_id + '"]').next('li').find('a').click();
		return false;
	});
})(jQuery);

(function($) {
	$(function() {
		$('select.styled, .widget_layered_nav select').combobox();
	});
})(jQuery);
