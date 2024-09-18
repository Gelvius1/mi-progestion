import composite from '../architecture/composite.js';

let rotation = 0,
 timeoutId,
 canClick = true,
 x = null,
 y = false,
 tableList = ['#hacer', '#programar', '#delegar', '#eliminar'];

$(document).on('click', 'span.close-filter', function(event) { closeFilter(event); });

$(document).on('click', 'div.figure', function(event) { clickArea(event); });

$(document).on({ 
  mousedown: function(event){ resetReload(event); }, 
  click: function(event){ clickReload(event); }, 
  mouseup: function(){ clearReloadTimer(); }, 
  mouseleave: function(event){ clearReloadTimer(); }, 
}, 'div.reload');

function closeFilter(event) {
    let self = event.target;
    let $a = $(self).closest("li");

    $a.fadeOut(300, function() {
        $a.removeClass("active");
        $a.addClass("hidden");

        let $fadeInElements = $('td.td-data:not(.last):not(:visible)').closest('tr');

        let fadeInPromise = $fadeInElements.fadeIn('slow').promise();

        fadeInPromise.done(function() {
			
			composite.call('fng', 'getPercentages');
			
            tableList.forEach(function(tableId) {
                $(tableId + " tbody tr:visible").each(function(index) {
                    $(this).find('span#counter').text(index + 1);
                    $(this).find('button.statChange').attr('data-level', index + 1);
                });
            });

            $('td.td-data.td-header:visible:not(.last)').removeClass('cursor-default');
            $('tr.last').find('td.td-data').removeClass('disabled');
        });
    });
}

function clickArea(event) {
    let self = $(event.target).closest('div.figure');
		
	composite.call('fng', 'filterTrigger', $(`li.filter-tag.${self.find('.bar').attr('class').split(' ').pop()}`), false);
	
    if (!self.is(':animated')) { 
        self.queue(function(next) {
            let idArea = $(this).attr('data-id-area');

            let $a = $('td.td-data:not(.last)').find('button').not(`[data-id-area='${idArea}']`).closest('tr').fadeOut('slow').promise();
            let $b = $('td.td-data:not(.last)').find('button').filter(`[data-id-area='${idArea}']`).closest('tr').fadeIn('slow').promise();

            $.when($a, $b).done(function() {
                $('tr.last').find('td.td-data').addClass('disabled');

				tableList.forEach(function(tableId) {
					$(tableId + " tbody tr:visible").each(function(index) {
						$(this).find('span#counter').text(index + 1);
						$(this).find('button.statChange').attr('data-level', index + 1);
					});
				});
				
				$('td.td-data.td-header:visible:not(.last)').addClass('cursor-default');
				
				composite.call('fng', 'getPercentages');				
            });

            next();
        });
    }
}

function clickReload(event) {
    if (canClick && !y) { 
        canClick = false;

		spinTrigger(180);

        composite.call('tng', 'init');

        setTimeout(function() {
            canClick = true;
        }, 1000);
    }
}

function resetReload(event) {
    y = false; 

    x = setTimeout(() => {
        
		spinTrigger(720);
		
		composite.call('mer', 'getData', 'unasigned');
		
		composite.call('fng', 'filterTrigger', $('li.filter-tag.unasigned'), true);
		
        y = true; 
    }, 1300); 
}

function triggerReload(event) {
    if (!y) {
        clickReload(event); 
    }
}

function clearReloadTimer() {
    clearTimeout(x); 
    x = null; 
}

function spinTrigger(degrees) {
    rotation += degrees;

    $('svg').css({
		'transition': 'transform 1s ease-in-out',
        'webkitTransform': 'translateZ(0px) rotateZ(' + rotation + 'deg)',
        'MozTransform': 'translateZ(0px) rotateZ(' + rotation + 'deg)',
        'transform': 'translateZ(0px) rotateZ(' + rotation + 'deg)'
    });    
}