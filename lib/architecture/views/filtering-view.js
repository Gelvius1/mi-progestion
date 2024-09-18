export default class VistaFiltering {
    constructor() {}
    
    getPercentages(data) {
		
		const total = data.total;

        Object.keys(data).forEach(key => {
            if (key !== 'total') {
                const value = data[key];
                const className = key; 

                if (value === -1) {
                    $(`div.bar.${className}`).addClass('disabled').parent().parent().addClass('disabled');
					
					$(`div.bar.${className}`).parent().next('.filter-link').text(0);
					
                } else {
                    $(`div.bar.${className}`).removeClass('disabled').parent().parent().removeClass('disabled');
                    
					const percentage = (value / total) * 100;

                    $(`div.bar.${className}`).parent().next('.filter-link').text(percentage);
                }
            }
        });
	
		$(".figure").each(function() {
			let $bar = $(this).find(".bar"),
				$val = $(this).find("span"),
				perc = parseInt($val.text(), 10);

			if (isNaN(perc) || perc == 0) {
				perc = 0;
				$(this).addClass('disabled')
			}

			$({ p: 0 }).animate({ p: perc }, {
				duration: 1500,
				easing: "swing",
				step: function(p) {
					p = isNaN(p) ? 0 : p;

					$bar.css({
						transform: "rotate(" + (45 + (p * 1.8)) + "deg)", // 100%=180° es: ° = % * 1.8
					});

					$val.text(Math.round(p)); 
				}
			});
		});
    }
	
	filterTrigger(self, type, etc){
		
		if(type){
			$('li.filter-tag:not(.reset)').removeClass('active').addClass('hidden');
			
			self.hide().fadeIn(1000);
			self.removeClass('hidden').addClass('active');	
			etc && self.find('#activeInterval').text(etc);
			
		} else {
			
			$('li.filter-tag:not(.reset):not(:visible)').removeClass('active').addClass('hidden');
			
			self.hide().fadeIn(1000);
			self.removeClass('hidden').addClass('active');			
		}

	}
}
