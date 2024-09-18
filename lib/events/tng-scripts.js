import composite from '../architecture/composite.js';

let b = true,
 c = 0,
 d,
 e = null;

const endClass = e => e === 0 ? 'ocasional' : (e === 1 ? 'periodico' : 'all');

$(document).on('click', 'table.timebloxing th', function(event) { switchScreens(event); });

$(document).on('change', 'input.form-check-input.interval', function(event) { taskInterval(event); });

$(document).on('click', 'span#interval-info', function(event) { checkboxRow(event); });

$(document).on({
	mouseenter: function(event) { counterContentIn(event) },
	mouseleave: function(event) { counterContentOut(event) },
}, 'small.filter-tag.timebloxing.info');

function switchScreens(event) {
    let self = event.target,
	 $a = $(self).data('target');

    if (!$('.table.timebloxing thead tr th').hasClass('disabled')) {
        let target = $a == 2 ? 1 : 2,
         content = $a;
		 
        $('tr[data-content="' + target + '"]').removeClass('timebloxing active').addClass('hidden');
        $('tr[data-content="' + content + '"]').removeClass('hidden').addClass('timebloxing active').hide().fadeIn(300);
        $('.timebloxing th').removeClass('active');
        $('.timebloxing th[data-target="' + content + '"]').addClass('active');
        
        $.cookie('tngh', target);
    }
}

function counterContentIn(event){
	let self = event.target;

	let $b = $('table.timebloxing input.form-check-input:checked'),
	 $a = $('table.timebloxing tbody tr p#info'),
	 f = '.table.timebloxing span.timebloxing';
	b ? b = false : clearTimeout(d);
	
    $(self).on('click', function(event) {
      clearTimeout(d);
      c = c == 3 ? 0 : c;
      if (!$(event.target).hasClass('disabled')) {
		if($b.length == 1){
			$a.attr({'data-id': $b.attr('data-id'),
			'data-name': $b.attr('data-name'),
			'data-hora-start': $b.attr('data-hora-start'),
			'data-hora-end': $b.attr('data-hora-end'),
			'data-id-areas': $b.attr('data-id-areas'),
			'data-datetime': $b.attr('data-datetime')});
			
			composite.call('mer', 'getData', 'onload', $b.attr('data-id') || null, $b.attr('data-idareas') || null);
			
			composite.call('fng', 'filterTrigger', $('li.filter-tag.block'), true, $b.attr('data-name'));
			
			$b.prop('checked', false);
			$(f + '.disabled').addClass('success').removeClass('disabled');
			$(f + '.danger').removeClass('danger').addClass('disabled');
			$(f + '.warning').removeClass('warning').addClass('disabled');			
		}else{
			c++;
			d = setTimeout(function() {
			  e = c == 1 ? 0 : c == 2 ? 1 : c == 3 ? "*" : null;
			  
			  composite.call('mer', 'getData', 'type', e);
			  
			  composite.call('fng', 'filterTrigger', $(`li.filter-tag.${endClass(e)}`), true);

			  $a.attr({'data-type': e != null ? e : '',
			  'data-id': '',
			  'data-name': '',
			  'data-hora-start': '',
			  'data-hora-end': '',
			  'data-id-areas': ''});
			  
			  c = 0;
			  e = null;
			}, 700);
	    }
	  }
    });	
}

function counterContentOut(event){
    let self = event.target;
	
	let $a = $('table.timebloxing tbody tr p#info');
	
	$(self).off('click');
    clearTimeout(d);
    if (!b && c > 0) {
      d = setTimeout(function() {
		e = c == 1 ? 0 : c == 2 ? 1 : c == 3 ? "*" : null;
		
		composite.call('mer', 'getData', 'type', e);
		
		composite.call('fng', 'filterTrigger', $(`li.filter-tag.${endClass(e)}`), true);
		
		$a.attr({'data-type': e != null ? e : '',
		'data-id': '',
		'data-name': '',
		'data-hora-start': '',
		'data-hora-end': '',
		'data-id-areas': ''});
        b = true;
        c = 0;
		e = null;
      }, 700);
    }
}

function taskInterval(event){
	
	let self = event.target;
	
	buttonsTrait(self);
}

function checkboxRow(event) {
    let self = event.target;
    let $a = $(self).closest('#interval-info').find('input[type="checkbox"]');

    if (!$(self).is('input[type="checkbox"]')) {
		let isChecked = $a.prop('checked');
		$a.prop('checked', !isChecked);		
	}
	
	buttonsTrait($a);
	
}

function buttonsTrait(input){
	
	let $a = $(input).closest('table.timebloxing').find('input.form-check-input.interval:checked'),
	 $b = $('span.timebloxing.success'),
	 $c = $('small.info'),
	 $d = $('span.filter-tag.timebloxing:nth-of-type(2)'),
	 $e = $('span.filter-tag.timebloxing:nth-of-type(3)');
	
	if ($a.length == 1) {
		
		$c.removeClass('disabled');
		$b.addClass('disabled');
		
		$d.removeClass('disabled').addClass('danger');
		$e.removeClass('disabled').addClass('warning');

	} else if ($a.length >= 1) {
		
		$c.addClass('disabled');
		$b.addClass('disabled');
		
		$d.removeClass('disabled').addClass('danger');
		$e.addClass('disabled').removeClass('warning');

	} else {
		
		$b.removeClass('disabled');
		
		$d.addClass('disabled').removeClass('danger');
		$e.addClass('disabled').removeClass('warning');

		$c.removeClass('disabled');
	}	
}
