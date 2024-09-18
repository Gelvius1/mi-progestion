import composite from './architecture/composite.js';

import './events/fng-scripts.js';
import './events/mer-scripts.js';
import './events/tng-scripts.js';

$(function() {	
	let a;

	$(document).ready(function() {
	  $('.loader').fadeOut(1000, function() {
		$('.loader').remove();
	  });
	});

	$(document).on({
		mouseover: function(event){ return tooltipIn(event); },
		mouseout: function(event){ return tooltipOut(event);  },
	},'[data-toggle="tooltip"]');
		
	composite.call('tng', 'init');	
	
	function tooltipIn(event){
		let self = event.target;
		
		$(self).tooltip({
			template: `
			<div class="tooltip tooltip-custom" role="tooltip">
				<div class="tooltip-arrow"></div>
				<div class="tooltip-inner"></div>
			</div>`
		}).tooltip('show');
	
		a = setTimeout(function() {
			$(self).tooltip('hide');
		}, 2000);	
	}
	
	function tooltipOut(event){
		let self = event.target;
		
		clearTimeout(a);
		$(self).tooltip('hide');	
	}
});