(function ($) {
	function Diagram(el, options) {
		var self = this;
		this.el = el;
		this.$el = $(el);
		this.$box = this.$el.find('.box');
		this.$skills_box = this.$el.find('.skills');
		this.$skills = this.$skills_box.find('.skill-arc');
		this.skills_count = this.$skills.size();
		this.diagram_rebuild_handler = false;
		
		jQuery(window).resize(function() {
			if (self.diagram_rebuild_handler)
				clearTimeout(self.diagram_rebuild_handler);
			self.diagram_rebuild_handler = setTimeout(function() {
				self.reinit();
			}, 50);
		});
		
		this.init();
	}
	
	$.fn.reverse = [].reverse;

	$.fn.circleDiagram = function(options) {
		return new Diagram(this.get(0), options);
	}
	
	Diagram.prototype = {
		init: function() {
			this.defaultText = '<span class="title">' + this.$el.data('title') + '</span><span class="summary">' + this.$el.data('summary') + '</span>';
			this.width = this.$box.parent().width();
			if (this.width == 0)
				this.width = parseInt(this.$box.closest('.box-wrapper').css('max-width'));
			this.height = this.width;
			this.$box.width(this.width);
			this.$box.height(this.height);
			
			this.max_font_size = this.$el.data('max-font-size') || -1;
			
			this.$el.find('.text').remove();
			this.$title = jQuery('<div class="text"><div>' + this.defaultText + '</div></div>');
			this.$title_content = this.$title.find('div');
			this.$box.after(this.$title);
			
			this.$el.find('.diagram-legend').remove();
			var legend = '<div class="diagram-legend">';
			this.$skills.each(function() {
				var t = $(this), 
					color = t.find('.color').val(),
					text = t.find('.title').text();
				legend += '<div class="legend-element clearfix"><span class="color" style="background: ' + color + '; width: 26px; height: 26px;"></span><span class="title">' + text + '</span></div>';
			});
			legend += '</div>';
			this.$legend = jQuery(legend);
			this.$box.parent().after(this.$legend);
			
			
			this.diagram();
		},
		
		reinit: function() {
			this.$box.html('');
			this.$box.css({
				width: 'auto',
				height: 'auto',
			});
			this.init();
		},
		
		random: function(l, u) {
			return Math.floor((Math.random()*(u-l+1))+l);
		},
		
		diagram: function(){
			var self = this;
			var offset = 4;
			var center_radius = this.width / (3 * 1.5) - 0.2 * parseInt(this.skills_count / 5);
			var stroke = (this.width / 2 - center_radius - 20)  / this.skills_count - offset;
			var diametr = 2 * (center_radius + (stroke + offset) * this.skills_count) + 2*stroke;
			var center_w = diametr / 2;
			var center_h = diametr / 2;
			
			this.width = diametr;
			this.height = diametr;
			this.$box.height(this.height);
			
			this.$title_content.width(center_radius * 2 - 10);
			this.$title_content.height(center_radius * 2);
			this.$title_content.css({
				'border-radius': center_radius,
				'-moz-border-radius': center_radius,
				'-webkit-border-radius': center_radius
			});
			this.$title.css({
				left: center_w - center_radius + 5,
				top: center_h - center_radius,
				fontSize: center_radius / 3,
				'border-radius': center_radius,
				'-moz-border-radius': center_radius,
				'-webkit-border-radius': center_radius
			});
			var summary_font_size = center_radius / 6;
			if (summary_font_size < 12)
				summary_font_size = 12;
			this.$title.find('.summary').css({
				fontSize: summary_font_size
			});
			
			if (this.$el.closest('.tab_wrapper').size() > 0)
				var legend_width = (this.$el.width() - (this.width + 20)) / 2;
			else
				var legend_width = this.$el.width() - (this.width + 20);
			
			if (legend_width > 200) {
				this.$legend.css({
					position: 'absolute',
					top: '50%',
					marginTop: -(this.$legend.height()/2),
					left: this.width + 20,
					width: legend_width,
				});
			} else {
				this.$legend.css({
					position: 'static',
					margin: '0 0 0 0'
				});
				this.$box.parent().after(this.$legend);
			}
			var legend_font_size = center_w/11 + 2;
			if (this.max_font_size != -1 && legend_font_size > this.max_font_size)
				legend_font_size = this.max_font_size;
			$('.color', this.$legend).width(center_w/11).height(center_w/11);
			$('.title', this.$legend).css({
				fontSize: legend_font_size,
				marginLeft: center_w/11 * 1.7
			});
			$('.legend-element', this.$legend).css({
				marginBottom: center_w/11
			});
			
			self.raphael = Raphael(this.$box[0], this.width, this.height),
				rad = center_radius + stroke * 0.67,
				speed = 250;
			
			self.raphael.circle(center_w, center_h, center_radius).attr({ stroke: 'none', fill: '#ffffff' });
			
			self.raphael.customAttributes.arc = function(value, color, rad){
				var v = 3.6*value,
					alpha = v == 360 ? 359.99 : v,
					random = self.random(91, 240),
					a = (random-alpha) * Math.PI/180,
					b = random * Math.PI/180,
					sx = center_w + rad * Math.cos(b),
					sy = center_h - rad * Math.sin(b),
					x = center_w + rad * Math.cos(a),
					y = center_h - rad * Math.sin(a),
					path = [['M', sx, sy], ['A', rad, rad, 0, +(alpha > 180), 1, x, y]];
				return { path: path, stroke: color }
			}
			
			this.$skills.each(function(i){
				var t = $(this), 
					color = t.find('.color').val(),
					value = t.find('.percent').val(),
					text = t.find('.title').text();
				
				var z = self.raphael.path().attr({ arc: [value, color, rad], 'stroke-width': stroke });
				rad += stroke + 6;
				z.mouseover(function(){
					this.animate({ 'stroke-width': stroke*1.5, opacity: 0.75 }, 1000, 'elastic');
					if(Raphael.type != 'VML') //solves IE problem
					this.toFront();
					self.$title_content.stop().animate({ opacity: 0 }, speed, function(){
						self.$title_content.css({paddingTop: 5}).html(text + '<span style="font-size: ' + (center_radius / 2) + 'px;">' + value + '%</span>').animate({ opacity: 1 }, speed);
					});
				}).mouseout(function(){
					this.stop().animate({ 'stroke-width': stroke, opacity: 1 }, speed*4, 'elastic');
					self.$title_content.stop().animate({ opacity: 0 }, speed, function(){
						self.$title_content.css({paddingTop: 0}).html(self.defaultText).animate({ opacity: 1 }, speed);
						self.$title.find('.summary').css({
							fontSize: summary_font_size
						});
					});	
				});
			});
		}
	};
}(jQuery));

jQuery(document).ready(function() {
	jQuery('.diagram-circle').each(function() {
		jQuery(this).circleDiagram();
	});
});
