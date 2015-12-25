(function ($) {
	
	var lazy_effects = {
		'clip': {
			show:	function(element) {
						$(element.el).animate({
							transform: 'scale(1.1)',
						},
						{
							duration : 200,
						}).animate({
							transform: 'scale(1)',
						},
						{
							duration : 200,
							complete: function() {
								if (element.options.queueType == 'sync')
									element.finishAnimation();
							}
						})
					}
		},
		
		'fading': {
			show:	function(element) {
						$(element.el).css({
							opacity: 0
						}).animate({
							opacity: 1
						},
						{
							duration : 800,
							complete: function() {
								if (element.options.queueType == 'sync')
									element.finishAnimation();
							}
						});
					}
		},
		
		'drop-right': {
			show:	function(element) {
						var left = parseInt($(element.el).width()/15);
						$(element.el).wrapInner('<div style="position: relative; left: ' + left + 'px;"></div>').css({
							opacity: 1
						});
						
						$(element.el).find('> div').css({
							opacity: 0
						}).animate({
							opacity: 1,
							left: 0,
						},
						{
							duration : 1400,
							complete: function() {
								$(element.el).html($(element.el).find('> div').html());
								if (element.options.queueType == 'sync')
									element.finishAnimation();
							}
						});
					}
		},
		
		'drop-right-unwrap': {
			show:	function(element) {
						var left = parseInt($(element.el).width()/15);
						$(element.el).wrapInner('<div style="position: relative; left: ' + left + 'px;"></div>').css({
							opacity: 1
						});
						
						$(element.el).find('> div').css({
							opacity: 0
						}).animate({
							opacity: 1,
							left: 0,
						},
						{
							duration : 1400,
							complete: function() {
								$(element.el).unwrap();
								if (element.options.queueType == 'sync')
									element.finishAnimation();
							}
						});
					}
		},
		
		'drop-left': {
			show:	function(element) {
						var right = parseInt($(element.el).width()/15);
						$(element.el).wrapInner('<div style="position: relative; right: ' + right + 'px;"></div>').css({
							opacity: 1
						});
						
						$(element.el).find('> div').css({
							opacity: 0
						}).animate({
							opacity: 1,
							right: 0
						},
						{
							duration : 1400,
							complete: function() {
								$(element.el).html($(element.el).find('> div').html());
								if (element.options.queueType == 'sync')
									element.finishAnimation();
							}
						});
					}
		},
		
		'drop-bottom': {
			show:	function(element) {
						var top = parseInt($(element.el).height()/15);
						$(element.el).wrapInner('<div style="position: relative; top: ' + top + 'px;"></div>').css({
							opacity: 1
						});
						
						$(element.el).find('> div').css({
							opacity: 0
						}).animate({
							opacity: 1,
							top: 0
						},
						{
							duration : 1400,
							complete: function() {
								$(element.el).html($(element.el).find('> div').html());
								if (element.options.queueType == 'sync')
									element.finishAnimation();
							}
						});
					}
		},
		
		'drop-top': {
			show:	function(element) {
						var step = $(element.el).data('ll-step') || 0.07;
						step = parseFloat(step);
						var bottom = parseInt($(element.el).height() * step);
						$(element.el).wrapInner('<div style="position: relative; bottom: ' + bottom + 'px;"></div>').css({
							opacity: 1
						});
						
						$(element.el).find('> div').css({
							opacity: 0
						}).animate({
							opacity: 1,
							bottom: 0
						},
						{
							duration : 1400,
							complete: function() {
								$(element.el).html($(element.el).find('> div').html());
								if (element.options.queueType == 'sync')
									element.finishAnimation();
							}
						});
					}
		},
		
		'slide-right': {
			show:	function(element) {
						$(element.el).parent().css({
							overflow: 'hidden'
						});
						$(element.el).css({
							opacity: 1,
							position: 'relative',
							left: '100%'
						}).animate({left: 0}, 150).animate({left: -15}, 150).animate({left: 0}, 150, function() {
							$(element.el).parent().css({
								overflow: 'visible'
							})
							if (element.options.queueType == 'sync')
								element.finishAnimation();
						});
					}
		},
		
		'action': {
			show:	function(element) {
						var func = $(element.el).data('ll-action-func') || '';
						if (!func || window[func] == null || window[func] == undefined)
							return;
						
						window[func](element.el);
					}
		},
	};
	
	function Element(el, options) {
		this.el = el;
		
		this.options = {
			offset: 1,
			delay: -1,
		};
		$.extend(this.options, options);
		
		if (this.options['delay'] == undefined || this.options['delay'] == null)
			this.options['delay'] = -1;
		this.options.queueType = this.options.delay == -1 ? 'sync': 'async';
	}
	
	function Group(el, options) {
		this.el = el;
		this.queue = new Queue(this);
		
		this.options = {
			offset: 0.7,
			delay: -1,
			queueType: 'sync',
			isFirst: false,
			force: false
		};
		$.extend(this.options, options);
		
		if (this.options['itemDelay'] == undefined || this.options['itemDelay'] == null)
			this.options['itemDelay'] = -1;
		this.options.itemQueueType = this.options.itemDelay == -1 ? 'sync': 'async';
		this.options['finishDelay'] = this.options['finishDelay'] || 300;
	}
	
	function Queue(obj) {
		this.object = obj;
		this.queue = [];
		this.is_exec = false;
	}
	
	function LazyLoading(options) {
		this.options = {
		};
		$.extend(this.options, options);
		this.initialize();
	}
	
	$.fn.reverse = [].reverse;
	
	String.prototype.startsWith = function (str) {
		return this.indexOf(str) == 0;
	};

	$.lazyLoading = function(options) {
		return new LazyLoading(options);
	}
	
	var ua = navigator.userAgent.toLowerCase(),
	platform = navigator.platform.toLowerCase(),
	UA = ua.match(/(opera|ie|firefox|chrome|version)[\s\/:]([\w\d\.]+)?.*?(safari|version[\s\/:]([\w\d\.]+)|$)/) || [null, 'unknown', 0],
	mode = UA[1] == 'ie' && document.documentMode;
	
	var Browser = {
		name: (UA[1] == 'version') ? UA[3] : UA[1],
		Platform: {
			name: ua.match(/ip(?:ad|od|hone)/) ? 'ios' : (ua.match(/(?:webos|android)/) || platform.match(/mac|win|linux/) || ['other'])[0]
		},
	};
	
	function getOffset(elem) {
		if (elem.getBoundingClientRect && Browser.Platform.name != 'ios'){
			var bound = elem.getBoundingClientRect(),
				html = elem.ownerDocument.documentElement,
				htmlScroll = getScroll(html),
				elemScrolls = getScrolls(elem),
				isFixed = (styleString(elem, 'position') == 'fixed');
			return {
				x: parseInt(bound.left) + elemScrolls.x + ((isFixed) ? 0 : htmlScroll.x) - html.clientLeft,
				y: parseInt(bound.top)  + elemScrolls.y + ((isFixed) ? 0 : htmlScroll.y) - html.clientTop
			};
		}

		var element = elem, position = {x: 0, y: 0};
		if (isBody(elem)) return position;

		while (element && !isBody(element)){
			position.x += element.offsetLeft;
			position.y += element.offsetTop;

			if (Browser.name == 'firefox'){
				if (!borderBox(element)){
					position.x += leftBorder(element);
					position.y += topBorder(element);
				}
				var parent = element.parentNode;
				if (parent && styleString(parent, 'overflow') != 'visible'){
					position.x += leftBorder(parent);
					position.y += topBorder(parent);
				}
			} else if (element != elem && Browser.name == 'safari'){
				position.x += leftBorder(element);
				position.y += topBorder(element);
			}

			element = element.offsetParent;
		}
		if (Browser.name == 'firefox' && !borderBox(elem)){
			position.x -= leftBorder(elem);
			position.y -= topBorder(elem);
		}
		return position;
	};
	
	function getScroll(elem){
		return {x: window.pageXOffset || document.documentElement.scrollLeft, y: window.pageYOffset || document.documentElement.scrollTop};
	};
	
	function getScrolls(elem){
		var element = elem.parentNode, position = {x: 0, y: 0};
		while (element && !isBody(element)){
			position.x += element.scrollLeft;
			position.y += element.scrollTop;
			element = element.parentNode;
		}
		return position;
	};
	
	function styleString(element, style) {
		return $(element).css(style);
	};

	function styleNumber(element, style){
		return parseInt(styleString(element, style)) || 0;
	};

	function borderBox(element){
		return styleString(element, '-moz-box-sizing') == 'border-box';
	};

	function topBorder(element){
		return styleNumber(element, 'border-top-width');
	};

	function leftBorder(element){
		return styleNumber(element, 'border-left-width');
	};

	function isBody(element){
		return (/^(?:body|html)$/i).test(element.tagName);
	};
	
	LazyLoading.prototype = {
		initialize: function() {
			this.animated = false;
			this.groups = [];
			this.queue = new Queue(this);
			this.init = true;
			
			this.hasHeaderVisuals = $('.ls-wp-container').size() > 0;
			
			$(document).find('.lazy-loading:first').addClass('lazy-loading-first');
			$(document).find('.lazy-loading').not('.lazy-loading-not-hide').css({visibility: 'hidden'});
			
			$(document).ready(function() {
				self.rebuild();
					
				$(window).resize(function() {
					if (self.resizeTimeout) {
						clearTimeout(self.resizeTimeout);
					}
					self.rebuild();
				});
			});
			
			var self = this;
			$(window).scroll(function() {
				if (!self.animated) {
					if (self.init)
						self.buildList();
					self.init = false;
					setTimeout(function() {
						self.scrollPageHandler();
					}, 100);
					self.animated = true;
				}
			});
			
			$(window).on('lazy-loading-start', function() {
				self.rebuild();
			});
		},
		
		rebuild: function() {
			this.buildList();
			this.scrollPageHandler();
		},
		
		scrollPageHandler: function() {
			var self = this;
			
			var new_elements = [];
			var window_bottom = $(window).scrollTop() + $(window).height();
			$.each(this.groups, function(index, group) {
				if (group.is_visible(window_bottom)) {
					group.show();
				} else {
					new_elements.push(group);
				}
			});
			this.queue.next();
			this.groups = new_elements;
			this.animated = false;
		},
		
		buildList: function() {
			var self = this;
			this.groups = [];
			$(document).find('.lazy-loading').not('.lazy-loading-showed').each(function() {
				var group_position = getOffset(this);
				var group = new Group(this, {
								position: [group_position.x, group_position.y],
								size: [this.offsetWidth, this.offsetHeight],
								offset: $(this).data('ll-offset') || 0.7,
								lazyLoading: self,
								itemDelay: $(this).data('ll-item-delay'),
								isFirst: self.hasHeaderVisuals && $(this).hasClass('lazy-loading-first'),
								finishDelay: $(this).data('ll-finish-delay'),
								force: $(this).data('ll-force-start') != undefined && $(this).data('ll-force-start') != null
							});
				
				var elements = [];
				$(this).find('.lazy-loading-item').not('.lazy-loading-showed').each(function() {
					var position = getOffset(this);
					var effect = self.getEffect(this);
					if (effect == '') {
						$(this).css({
							opacity: 1
						});
						return;
					}
					var el_delay = group.options.itemDelay;
					var element_delay = $(this).data('ll-item-delay');
					if (element_delay != null && element_delay != undefined) {
						el_delay = element_delay;
					}
					element = new Element(this, {
						position: [position.x, position.y],
						size: [this.offsetWidth, this.offsetHeight],
						effect: effect,
						group: group,
						delay: el_delay,
					});
					elements.push(element);
				});
				
				if (elements.length > 0) {
					group.setElements(elements);
					self.groups.push(group);
				}
			});
		},
		
		getEffect: function(element) {
			return $(element).data('ll-effect') || '';
		},
		
		finishAnimation: function() {
		}
	};
	
	Group.prototype = {
		is_visible: function(window_bottom) {
			if (this.options.force)
				return true;
			if ((this.options.position[1] + parseFloat(this.options.offset) * this.options.size[1]) <= window_bottom)
				return true;
			else
				return false;
		},
		
		show: function() {
			this.options.lazyLoading.queue.add(this);
			$(this.el).addClass('lazy-loading-showed');
		},
		
		setElements: function(elements) {
			this.elements = elements;
		},
		
		startAnimation: function() {
			var self = this;
			
			$(this.el).css({visibility: 'visible'});
			
			$.each(this.elements, function(index, element) {
				if (self.elements[index].options.effect != 'action')
					if (self.elements[index].options.effect != 'clip')
						$(self.elements[index].el).css({
							opacity: 0
						});
					else
						$(self.elements[index].el).css({
							position: 'relative',
							transform: 'scale(0)'
						});
				if (index == self.elements.length - 1)
					self.elements[index].options.queueType = 'sync';
				self.elements[index].show();
			});
			if (this.options.isFirst) {
				setTimeout(function() {
					self.queue.next();
				}, 500);
			} else {
				this.queue.next();
			}
			setTimeout(function() {
				self.finishAnimation();
			}, this.options.finishDelay);
		},
		
		finishAnimation: function() {
			this.options.lazyLoading.queue.finishPosition();
		}
	};
	
	Element.prototype = {
		is_visible: function(window_bottom) {
			var lazy_effect = lazy_effects[this.options.effect] || {};
			var offset = lazy_effect['offset'] || this.options.offset;
			if ((this.options.position[1] + offset * this.options.size[1]) <= window_bottom)
				return true;
			else
				return false;
		},
		
		show: function() {
			this.options.group.queue.add(this);
			$(this.el).addClass('lazy-loading-showed');
		},
		
		startAnimation: function() {
			var self = this;
			var lazy_effect = lazy_effects[this.options.effect] || {};
			var func = lazy_effect['show'] || function() {};
			func(this);
			if (this.options.delay >= 0 && this.options.queueType == 'async')
				if (this.options.delay > 0)
					setTimeout(function() {
						self.finishAnimation();
					}, this.options.delay);
				else
					self.finishAnimation();
		},
		
		finishAnimation: function() {
			this.options.group.queue.finishPosition();
		}
	};
	
	Queue.prototype = {
		add: function(obj) {
			this.queue.push(obj);
			//this.next();
		},
		
		next: function() {
			if (this.is_exec || this.queue.length == 0)
				return false;
				
			this.is_exec = true;
			var obj = this.queue.shift();
			obj.startAnimation();
		},
		
		finishPosition: function() {
			this.is_exec = false;
			if (this.queue.length > 0)
				this.next();
		}
	};

}(jQuery));
