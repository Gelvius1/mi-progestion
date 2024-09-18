import composite from '../architecture/composite.js';
import sortable from '../plugins/sortable.js';

import initToastsPlugin from '../plugins/toasts.js';

const _sortable = sortable();

const tableBreed = a => a == 'hacer' ? 1 : a == 'programar' ? 2 : a == 'delegar' ? 3 : a == 'eliminar' ? 4 : null,
 intTableBreed = a => a == 1 ? "#hacer" : a == 2 ? '#programar' : a == 3 ? '#delegar' : a == 4 ? "#eliminar" : null;

let c = 0, 
 tableBreedId = 0,
 dataLevel = 0,
 tdId = 0,
 tableId = '',
 valueTo = '',
 restParameters = [];

$(document).on('change', 'input.form-check-input.type', function(event) { taskType(event); });

$(document).on('input', 'td.td-data[contenteditable]', function(event) { limitTaskCharacters(event); });

$(document).on({
	mousedown: function(event) { traitCells(event) },
	keydown: function(event) { traitCells(event) },
	focus: function(event) { traitCells(event) },
	blur: function(event) { behaviorCells(event) }
}, 'td.td-data[contenteditable]');

$(document).on({
	mousedown: function(event) { traitModalContent(event) },
	keydown: function(event) { traitModalContent(event) },
	focus: function(event) { traitModalContent(event) },
	blur: function(event) { traitModalBlurContent(event) }
}, 'div.modal-body[contenteditable]');

$(document).on({
	mouseenter: function(event) { headerIn(event) },
    mouseleave: function(event) { headerOut(event) },
}, 'td.td-header:not(.last)');

function taskType(event) {
    let self = event.target;
	
	let checked = 0;
    
	tableId = $(self).closest('.table').attr('id'),
    tableBreedId = tableBreed(tableId);
    
	dataLevel = $(self).closest('td').find('button.statChange').attr('data-level');
    tdId = $(self).attr('id') || null;
    
	checked = $(self).prop('checked') ? 1 : 0;
	
    restParameters = ['mer', 'update', 'checkbox', checked, dataLevel, tableBreedId, tdId];
    genericAjax('services/ajax/genericQuery.php', function(){
		
		$(self).attr('data-bs-original-title',
			checked ? 'Actualmente periódica' :
			'Actualmente ocasional')
		.tooltip('show');

		initToastsPlugin().createToast({
			type: 'success',
			icon: 'check-circle',
			message: 'Se ha actualizado el tipo de tarea.',
			duration: 5000,
		})
		
	}, null, function(){
		initToastsPlugin().createToast({
			type: 'error',
			icon: 'exclamation-triangle',
			message: 'No se pudo actualizar el tipo de tarea.',
			duration: 5000,
		})		
	}, ...restParameters);
}

function traitCells(event){

	let self = event.target;

    $(self).text().trim() === "..." && $(self).text("");

    (event.which === 3) ? (event.preventDefault(), false) :
    (event.key === "Enter" || event.key === "Escape") && (event.preventDefault(), $(self).blur(), false);
}

function behaviorCells(event){
	let self = event.target;

	let $a = $(self).closest('tr'),
	 $b = $('p#info');

	tableId = $(self).closest('table').attr('id');
	tableBreedId = tableBreed(tableId);

	valueTo = $(self).text().trim();

	tdId = $(self).prev('td.td-header').find('.form-check-input').attr('id') || null; 	
	dataLevel = $(self).prev('td').find('button').attr('data-level');
	
	let counter = $a.find('span#counter'),
	 intervalId = $b.attr('data-id') || 0,
	 typeTo = $b.attr('data-type') || 0;

	typeTo = typeTo != 1 || typeTo != 0 ? 0 : typeTo;
	
	
	if (valueTo == "" || valueTo == null) {
		
		if (!$(self).hasClass('last')) {

			restParameters = ['mer', 'erase', dataLevel, tableBreedId, tdId];
			genericAjax('./services/ajax/genericQuery.php', null, function(){
				$a.fadeOut(500, () => {
					$a.remove();
					$("#" + tableId + " tbody tr:visible").each(function(index) {
						$(this).find('span#counter').text(index + 1);
						$(this).find('button.statChange').attr('data-level', index + 1); 
					});
					composite.call('fng', 'getPercentages');
					
					initToastsPlugin().createToast({
						type: 'success',
						icon: 'check-circle',
						message: 'Se ha borrado la tarea.',
						duration: 5000,
					})					
				});
			}, function(){
				initToastsPlugin().createToast({
					type: 'error',
					icon: 'exclamation-triangle',
					message: 'No se ha podido borrar la tarea.',
					duration: 5000,
				})				
			}, ...restParameters);

		} else $(self).text("...");
		
	} else if ($a.hasClass('last')) {
		
		dataLevel = parseInt($a.prev('tr').find('td.td-header button').attr('data-level') || 0) + 1;

		restParameters = ['mer', 'create', tableBreedId, valueTo, dataLevel, intervalId, typeTo];
		genericAjax('./services/ajax/genericQuery.php', function(response){
				let lastId = response.data,
				 $x = $(self).prev('td');
				
				$(self).removeClass('last');
				$a.find('.td-header.last').removeClass('last');
				$a.removeClass('last');
				
				$a.find('td.td-header').append(`
					<input type="checkbox" class="form-check-input py-1 type" data-toggle="tooltip" title="Actualmente ocasional">
					<button type="button" class="statChange align-middle mt--2"
					 style="background-color: rgb(246 246 246)"
					 data-toggle="tooltip" title="Presione para asignar..."
					 data-level=${dataLevel} 
					 data-id-area="-1" 
					 data-id-areas-interval="undefined"></button>
				`)				
				
				$x.find('input[type="checkbox"]').attr('id', lastId);				
				$x.find('button[type="button"].statChange[hidden]').remove();
				
				$a.after(`
					<tr class="last" style="display: none;">
						<td class="w-18 td-data td-header last">
							<span id="counter">${parseInt(counter.text() || 0) + 1}</span>
							<button type="button" class="statChange" 
							 data-level=${parseFloat(dataLevel) + 2} 
							 hidden></button>						
						</td>
						<td class="td-data last" contenteditable>...</td>
					</tr>
				`).next().fadeIn(500);	

				initToastsPlugin().createToast({
					type: 'success',
					icon: 'check-circle',
					message: 'Se ha insertado una nueva tarea.',
					duration: 5000,
				})
				
			}, null, function(){
				initToastsPlugin().createToast({
					type: 'error',
					icon: 'exclamation-triangle',
					message: 'No se ha podido insertar la tarea',
					duration: 5000,
				})
			}, ...restParameters
		);
		
	} else {
		
		restParameters = ['mer', 'update', 'data', valueTo, dataLevel, tableBreedId, tdId];
		genericAjax('./services/ajax/genericQuery.php', null, null, null, ...restParameters);
		
	}
}

function traitModalContent(event){

	let self = event.target;

	$(self).text().trim() == "Ingrese sus observaciones..." && $(self).text("");

	if (event.which == 3) {
		event.preventDefault();
		return false;
		
	} else if (event.key == "Escape") {
		event.preventDefault();
		$(self).trigger('blur');
		return false;
		
	} else if(event.key == 'Tab'){
		event.preventDefault(); 
		
		let selection = window.getSelection(),
		 selectedText = selection.toString(),
		 cursorPosition = selection.focusOffset;
		
		document.execCommand('insertText', false, '\t');
	}
}

function traitModalBlurContent(event){
	let self = event.target;

	let $a = $(self).prev('.modal-header');

	let texto = $(self).html()
		.replace(/<(br|p|div)[^>]*>/g, '\n')
		.replace(/<\/?\w+[^>]*>/g, '')
		.replace(/&nbsp;/g, ' ')
		.replace(/\t/g, '\t')
		.trim(); 

	valueTo = encodeURIComponent(texto);
	dataLevel = $a.attr('data-level');
	tableId = $a.attr('data-table-id');
	tdId = $a.attr('id');

	restParameters = ['mer', 'update', 'modal', valueTo, dataLevel, tableId, tdId];
	genericAjax('services/ajax/genericQuery.php', null, function(){
		(valueTo == "" || valueTo == null) && $(self).html("<span style='color:#b5b5b5'>Ingrese sus observaciones...</span>");
	
		initToastsPlugin().createToast({
			type: 'success',
			icon: 'check-circle',
			message: 'Se ha guardado la información.',
			duration: 5000,
		})	
	}, function(){
		initToastsPlugin().createToast({
			type: 'error',
			icon: 'exclamation-triangle',
			message: 'No se ha guardado la información.',
			duration: 5000,
		})
	}, ...restParameters);
}

function headerIn(event){
	let self = event.target;
	
	let a = '.td-header:not(.last)';
	
	$(document).off('click', a);
	$(self).removeClass('pretext');
	
	$('#fsModal').off('hidden.bs.modal');
	
	$(document).on('click', a, function(event) {
	  if ($(event.target).closest('.type, .statChange').length === 0) {
		c++;
		  if (c == 1) $(self).addClass('pretext');
		  else if (c == 2) {
		
			let modalId = $(self).find('input[type="checkbox"]').attr('id');
			
			restParameters = ['mer', 'read', 'modal', modalId];
			genericAjax(
				'./services/ajax/genericQuery.php',
				function(response) {

					  let data = response.data.map(item => ({ ...item })),
					  tableId = (data[0]['breed']) || null,
					  tableBreedId = intTableBreed(tableId);
					  
					  let colorDeFondo = $('table' + tableBreedId + ' button.statChange[data-level="' + data[0]['level'] + '"]').css('background-color');

					  $('body').append(`
						  <div id="fsModal" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
							  <div class="modal-dialog">
								  <div class="modal-content" style="border: 3px solid ${ colorDeFondo == 'rgb(246, 246, 246)' ? 'rgb(113 113 113)' : colorDeFondo }">
									  <div class="modal-header" 
									   id="${modalId}"
									   data-table-id = "${data[0]['breed']}" 
									   data-level="${data[0]['level']}" 
									   style="background: ${ colorDeFondo == 'rgb(246, 246, 246)' ? 'rgb(113 113 113)' : colorDeFondo }">
										  <h1 id="myModalLabel" class="modal-title" style='overflow: hidden; text-overflow: ellipsis; white-space: nowrap;'>
											  ${ (data[0]['value']) }
										  </h1>
										  <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
									  </div>
									  <div class="modal-body" contenteditable>
										  ${(data[0]['observaciones'] == null) ? "<span style='color: #b5b5b5'>Ingrese sus observaciones...</span>" :
											 data[0]['observaciones'].replace(/\n{3,}/g, '\n\n').replace(/\n/g, '<br/>')}
									  </div>      
								  </div>
							  </div>
						  </div>
					  `);
					  
					  $('#fsModal').modal('show');
				},	
				function() {
					  $('#fsModal').on('hidden.bs.modal', function () {
						  $(this).remove();
					  });
					  
					  $(self).removeClass('pretext');
					  c = 0;					  
				}, function(){
					initToastsPlugin().createToast({
						type: 'error',
						icon: 'exclamation-triangle',
						message: 'No se pudo acceder a la información.',
						duration: 5000,
					})					
				}, ...restParameters
			);
		  }
	  }
	});
};

function headerOut(event){
	let self = event.target;

	$(self).removeClass('pretext');
	c = 0;
}

function limitTaskCharacters(event){
    let self = event.target,
        $a = $(self).text();
    
    if ($a.length > 50) {
        $(self).text($a.substring(0, 50));
        
        let range = document.createRange(),
            selection = window.getSelection();
        
        if ($(self).contents().length > 0) {
            let textNode = $(self).contents().get(0);
            
            range.setStart(textNode, 50);
            range.collapse(true);
            
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }
}
