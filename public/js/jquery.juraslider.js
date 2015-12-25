(function ($) {
	
	function Slider(el, options) {
		var self = this;
		this.el = el;
		this.$el = $(el);
		
		this.options = {
			element: 'li',
			margin: 0,
			delay: 100,
			duration: 200,
			prevButton: false,
			nextButton: false,
			loop: true
		};
		$.extend(this.options, options);
		setTimeout(function() {
			self.initialize();
		}, 500);
	}
	
	$.fn.reverse = [].reverse;

	$.fn.juraSlider = function(options) {
		return new Slider(this.get(0), options);
	}
	
	Slider.prototype = {
		initialize: function() {
			var self = this;
			
			this.is_animation = false;
			
			this.$el.css({
				whiteSpace: 'nowrap',
				height: this.$el.find(this.options.element + ':first').height(),
				position: 'relative'
			});
			
			this.$el.parent().css({
				overflow: 'hidden',
			});
			
			this.$el.find(this.options.element).css({
				margin: 0,
				position: 'absolute',
				left: this.$el.width(),
				top: 0,
				zIndex: 1
			}).addClass('rightPosition');
			
			if (this.options.nextButton)
				this.options.nextButton.click(function() {
					self.triggerNext(false);
				});
			
			if (this.options.prevButton)
				this.options.prevButton.click(function() {
					self.triggerPrev();
				});
			
			this.triggerNext(true);
		},
		
		getNextCount: function() {
			var self = this;
			var count = 0;
			var next_width = 0;
			var index = 0;
			var el_width = this.$el.width();
			var new_width = 0;
			this.$el.find(this.options.element + '.rightPosition').each(function() {
				var width = $(this).width();
				if (index > 0)
					width += self.options.margin;
				new_width = next_width + width;
				if (new_width > el_width)
					return false;
				next_width = next_width + width;
				count += 1;
				index += 1;
			});
			if (this.options.loop && new_width < el_width) {
				this.$el.find(this.options.element + '.leftPosition').each(function() {
					var width = $(this).width();
					if (index > 0)
						width += self.options.margin;
					new_width = next_width + width;
					if (new_width > el_width)
						return false;
					$(this).css({left: el_width}).removeClass('leftPosition').addClass('rightPosition').appendTo(self.$el);
					next_width = next_width + width;
					count += 1;
					index += 1;
				});
			}
			return [count, next_width];
		},
		
		triggerNext: function(init) {
			if (this.is_animation)
				return false;
				
			var self = this;
			var info = this.getNextCount();
			if (init && info[0] == this.$el.find(this.options.element).size()) {
				if (this.options.nextButton)
					this.options.nextButton.hide();
				if (this.options.prevButton)
					this.options.prevButton.hide();
			}
			if (info[0] < 1)
				return false;
			
			this.is_animation = true;
			
			this.hideLeft();
			
			setTimeout(function() {
				self.showNext(info);
			}, 300);
		},
		
		hideLeft: function() {
			var delay = 0;
			var app = this;
			app.$el.find(app.options.element + '.currentPosition').each(function() {
				var self = this;
				setTimeout(function() {
					var offset = $(self).width();
					$(self).animate({left: -offset}, {
						duration: app.options.duration,
						queue: false,
						complete: function() {
							$(this).removeClass('currentPosition').addClass('leftPosition');
						}
					});
				}, delay);
				delay += app.options.delay;
			});
		},
		
		showNext: function(info) {
			var app = this;
			if (info[0] < 1)
				return false;
			
			var offset = (app.$el.width() - info[1]) / 2;
			var delay = 0;
			var index = 0;
			app.$el.find(app.options.element + '.rightPosition:lt(' + info[0] + ')').each(function() {
				var self = this;
				app.showElement(self, offset, delay, index == (info[0] - 1));
				delay += app.options.delay;
				offset += $(self).width() + app.options.margin;
				index += 1;
			});
		},
		
		showElement: function(element, offset, delay, is_last) {
			var app = this;
			setTimeout(function() {
				$(element).animate({left: offset}, {
					duration: app.options.duration,
					queue: false,
					complete: function() {
						$(this).removeClass('rightPosition').removeClass('leftPosition').addClass('currentPosition');
						if (is_last)
							app.is_animation = false;
					}
				});
			}, delay);
		},
		
		getPrevCount: function() {
			var self = this;
			var count = 0;
			var prev_width = 0;
			var index = 0;
			var el_width = this.$el.width();
			var new_width = 0;
			this.$el.find(this.options.element + '.leftPosition').reverse().each(function() {
				var width = $(this).width();
				if (index > 0)
					width += self.options.margin;
				new_width = prev_width + width;
				if (new_width > el_width)
					return false;
				prev_width = prev_width + width;
				count += 1;
				index += 1;
			});
			if (this.options.loop && new_width < el_width) {
				this.$el.find(this.options.element + '.rightPosition').reverse().each(function() {
					var width = $(this).width();
					if (index > 0)
						width += self.options.margin;
					new_width = prev_width + width;
					if (new_width > el_width)
						return false;
					$(this).css({left: -width}).removeClass('rightPosition').addClass('leftPosition').prependTo(self.$el);
					prev_width = prev_width + width;
					count += 1;
					index += 1;
				});
			}
			return [count, prev_width];
		},
		
		triggerPrev: function() {
			if (this.is_animation)
				return false;
				
			var self = this;
			var info = this.getPrevCount();
			if (info[0] < 1)
				return false;
			
			this.is_animation = true;
			
			this.hideRight();
			
			setTimeout(function() {
				self.showPrev(info);
			}, 300);
		},
		
		hideRight: function() {
			var delay = 0;
			var app = this;
			var offset = app.$el.width();
			app.$el.find(app.options.element + '.currentPosition').reverse().each(function() {
				var self = this;
				setTimeout(function() {
					$(self).animate({left: offset}, {
						duration: app.options.duration,
						queue: false,
						complete: function() {
							$(this).removeClass('currentPosition').addClass('rightPosition');
						}
					});
				}, delay);
				delay += app.options.delay;
			});
		},
		
		showPrev: function(info) {
			var app = this;
			if (info[0] < 1)
				return false;
			
			var offset = info[1] + (app.$el.width() - info[1]) / 2;
			var delay = 0;
			var index = 0;
			
			app.$el.find(app.options.element + '.leftPosition').slice(-info[0]).reverse().each(function() {
				var self = this;
				offset -= $(self).width();
				if (index > 0)
					offset -= app.options.margin;
				app.showElement(self, offset, delay, index == (info[0] - 1));
				delay += app.options.delay;
				index += 1;
			});
		},
	};

}(jQuery));
