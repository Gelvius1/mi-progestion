import composite from '../../architecture/composite.js';

import initToastsPlugin from '../../plugins/toasts.js';

export default class vistaMatrizEisenhower {
  constructor() {
    this.tableValues = [
		'#hacer',
		'#programar',
		'#delegar',
		'#eliminar'
	];
	
 	this.vectorArea = [
		['var(--safica-color)', 'Salúd Física', 0],
		['var(--sameal-color)', 'Salúd Mental/Emocional', 1],
		['var(--reines-color)', 'Relaciones Interpersonales', 2],
		['var(--esaceo-color)', 'Carrera/Empleo', 3],
		['var(--defiro-color)', 'Desarrollo Financiero', 4],
		['var(--edenal-color)', 'Educación/Desarrollo Personal', 5]
	]; 
  }

  getData(content) {
	
	initToastsPlugin().createToast({
		type: 'system',
		icon: 'info-circle',
		message: content.message,
		duration: 3000,
	});	
	
	let data = !('data_inexistent' in content.data) ? content.data.map(item => ({ ...item })) : null,
		restParameters = [];
	
	let $a = $('table.sortable tbody'),
		$b = $('.td-header:not(.last)');
		
	const tableBreed = (a) => a == 1 ? "#hacer" : a == 2 ? '#programar' : a == 3 ? '#delegar' : a == 4 ? "#eliminar" : null
		
	$a.empty().hide().fadeIn(500);
		
	if (data !== null) {
		  
		this.tableValues.forEach(val => {
			$(val + ' tbody').empty();
			
			const filteredData =  Object.keys(data).map(key => data[key]).filter(item => {
			  const table = tableBreed(item.breed);
			  return val === table;
			});
			
			let a = 0;
			filteredData.forEach((item, index) => {
			  const checked = item.tipo == 1 || item.tipo == 2 ? "checked" : "",
			   difference = item.tipo == 2 ? parseInt(((new Date() - new Date(item.timestamp)) / (1000 * 60 * 60))) : null;
			  
			  let restrictAreas;
			  a = difference >= 24 || (content.status == 1  && item.tipo == 2) || item.tipo != 2 ? a + 1 : a + 0;

			  if(item.interval == 0) restrictAreas = 'undefined';
			  else if(item.interval > 0){
				  
				  let idInterval = item.interval;
				  
				  $('input[type="checkbox"].form-check-input:not(.type)').each(function() {
						if($(this).attr('data-id') == item.interval){
						  restrictAreas = $(this).attr('data-id-areas'); 
						  return false;							
						}  
				  });
				  
			  }else restrictAreas = $('p#info').attr('data-id-areas');
			  
			  if(difference >= 24 || (content.status == 1  && item.tipo == 2) || item.tipo != 2){
				  $(val + ' tbody').append(`
					<tr class="ui-state-default">
					  <td class="w-18 td-data td-header ${content.status == 1 ? "cursor-default" : ""}">
						<span id="counter">${a}</span>
						<input type="checkbox" class="form-check-input py-1 type" 
							id="${item.id}" 
							data-toggle="tooltip" 
							title="${item.tipo == 1 || item.tipo == 2 ? "Actualmente periódica" : "Actualmente ocasional"}" 
							${checked}>
							
						<button type="button" class="statChange align-middle mt--2" 
							data-toggle="tooltip" 
							title="${(item.area < 0) ? 'Presione para asignar...' : this.vectorArea[item.area][1]}" 
							style="background-color: ${(item.area < 0) ? 'rgb(246 246 246)' : this.vectorArea[item.area][0]}" 
							data-id-area="${item.area}" 
							data-id-interval="${item.interval}" 
							data-id-areas-interval="${restrictAreas}" 
							data-level="${parseFloat(item.level)}"></button>
					  </td>					
					  <td class="td-data" contenteditable='true'>
						${item.value}
					  </td>
					</tr>
				  `);
			  }
			  
			  if (difference >= 24) {
				restParameters = ['mer', 'update', 'type', 1, item.level, item.breed, item.id];
				genericAjax('./services/ajax/genericQuery.php', null, null, ...restParameters);
			  }
			});
		});
	}
	
    this.tableValues.forEach(val => {

      let counter = $(val + ' tbody').find('span#counter:last').text() || 0;
      let prevLevel = $(val + ' tbody').find('button.statChange:last').attr('data-level') || 0;

      $(val + ' tbody').append(`
        <tr class="last">
          <td class="w-18 td-data td-header last ${content.status == 1 ? "disabled" : ""}">
            <span id="counter">${parseInt(counter) + 1}</span>
            <button type="button" class="statChange" 
				data-level=${parseFloat(prevLevel) + 1} 
				hidden></button>						
          </td>
          <td class="td-data last ${content.status == 1 ? "disabled" : ""}" 
			${content.status != 1 ? "contenteditable" : ""}>...</td>
        </tr>
      `);
    }); 
	
	if(content.status == 1){
		$a.sortable("disable");
		$b.css('cursor', 'default');
	} else {
		$a.sortable("enable");
		$b.css('cursor', '');
	}
	
	composite.call('fng', 'init'); 
	
  }
}