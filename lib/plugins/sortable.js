export default function sortable() {
	let connectSort = ".sortable tbody, .overflow-limit",
	 tableIndices = {},
	 tableOrigen = "",
	 restParameters = [];
	
	const tableBreed = a => a == 'hacer' ? 1 : a == 'programar' ? 2 : a == 'delegar' ? 3 : a == 'eliminar' ? 4 : null;	
	
	$("table.sortable tbody").sortable({
	  opacity: 0.8, 
	  connectWith: connectSort,
	  items: "> tr:not(:last)",
	  appendTo: connectSort,
	  cursor: 'grabbing',
	  cancel: '[contenteditable], input, button, .cursor-default',
	  zIndex: 2,
	  start: (event, ui) => {		
		let $a = ui.item.closest('table').attr('id');
		
		tableIndices[$a] = ui.item.index();
		tableOrigen = $a;
	  },   
	  update: (event, ui) => {		
		let $a = ui.item.closest('table').attr('id'),
		 $b = ui.item.closest('div').hasClass('overflow-limit')
		
		const dataLevel = e => parseInt(e.find('.td-header button').attr('data-level')) || 0;

		if (!ui.sender && !$b) {
		  let currDataLevel = dataLevel(ui.item),
		   prevDataLevel = dataLevel(ui.item.prev('tr')),
		   nextDataLevel = dataLevel(ui.item.next('tr')),
		   calcDataLevel = parseFloat(((prevDataLevel + nextDataLevel) / 2)),
		   tableBreedIdStart = tableBreed(tableOrigen),
		   tableBreedIdEnd = tableBreed($a),
		   tdId = ui.item.find('.td-header input[type="checkbox"]').attr('id');

		  restParameters = ['mer', 'update', 'leveling', currDataLevel, calcDataLevel, tableBreedIdStart, tableBreedIdEnd, tdId];
		  genericAjax('services/ajax/genericQuery.php', null, null, null,...restParameters);
		}
	  },
	  change: (event, ui) => {
		
		let tableId = ui.placeholder.closest('table').attr('id'),
		 idx = ui.placeholder.prevAll().filter(':not(.ui-sortable-helper)').length,
		 idxPosition = idx - tableIndices[tableId],
		 scrollTable = ui.placeholder.closest('.scrolleable');

		scrollTable.animate({
		  scrollTop: (idxPosition >= 0 ? '+=' : '-=') + 80
		}, 500);
		tableIndices[tableId] = idx;
	  },
	  stop: (event, ui) => {
		const tableId = ui.item.closest('table').attr('id'),
		 $table = ui.item.closest('table'),
		 $lastRow = $table.find('tr.last');

		if ($lastRow.length && ui.item.index() > $lastRow.index()) ui.item.insertBefore($lastRow);

		$("#" + tableOrigen + " tbody tr").each(function(a) {
		  $(this).find('span#counter').text(a + 1);
		  $(this).find('.td-header button').attr('data-level', a + 1);
		});

		if (tableOrigen != tableId) {
		  $("#" + tableId + " tbody tr").each(function(b) {
			$(this).find('span#counter').text(b + 1);
			$(this).find('.td-header button').attr('data-level', b + 1);
		  });
		} 
	  }  
	});
	
	$('.overflow-limit').sortable({
		receive: function(event, ui) {
			try {
				let droppedOn = $(this).find('span').filter(function() {
					return $(this).offset().top + $(this).outerHeight() / 2 > ui.offset.top;
				}).first();
				
				if (droppedOn.is('#interval-info')) {
					
					let intId = $(droppedOn).closest('#interval-info').find('input').attr('data-id'),				
					 intArea = JSON.parse($(droppedOn).closest('#interval-info').find('input').attr('data-id-areas')),				
					 intItem = ui.item.find('button').attr('data-id-interval'),
					 areaItem = ui.item.find('button').attr('data-id-area'),
					 idItem = ui.item.find('input').attr('id'),
					 levelItem = ui.item.find('button').attr('data-level'),
					 breedItem = tableBreed(tableOrigen);

					if(intId == intItem){
						droppedOn.effect('pulsate');
						$(ui.sender).sortable('cancel'); 						

					}else{
						
						let updateArea = areaItem == -1 ? true : intArea.includes(parseInt(areaItem));
						
						restParameters = ['mer', 'update', 'transfering', intId, idItem, levelItem, breedItem, updateArea];
						genericAjax('services/ajax/genericQuery.php', function(){
							droppedOn.hide().fadeIn(400);
							!$('tr.last').find('td').hasClass('disabled') && ui.item.remove();							
						}, null, null, ...restParameters);
					}
					
				} else $(ui.sender).sortable('cancel');

				$(this).find('.ui-sortable-placeholder').remove();				
				
			} catch(error) {
				console.log(error)
				$(ui.sender).sortable('cancel');
			}  
		},
		placeholder: 'ui-sortable-placeholder',
		cancel: 'span'
	}).disableSelection();	
	
}