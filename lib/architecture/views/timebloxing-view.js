import composite from '../../architecture/composite.js';

import multiselect from '../../plugins/multiselect.js';
import flatpickr from '../../plugins/flatpickr.js';
import initToastsPlugin from '../../plugins/toasts.js';

export default class VistaTimebloxing {
  constructor(){
	this.a = null;
	this.b = null;
	this.m = null;
	this.index = null;
	this.x = null;
	this.y = false;
	this.restrictIntervals = {inicio: [], fin: []};
	this.vectorArea = [
		['var(--safica-color)', 'Salúd Física', 0],
		['var(--sameal-color)', 'Salúd Mental/Emocional', 1],
		['var(--reines-color)', 'Relaciones Interpersonales', 2],
		['var(--esaceo-color)', 'Carrera/Empleo', 3],
		['var(--defiro-color)', 'Desarrollo Financiero', 4],
		['var(--edenal-color)', 'Educación/Desarrollo Personal', 5]
	];
	
	let self = this;
	
    $(function(){
	  
	  $(document).on({ 
		mousedown: function(event){ self.resetStats(event); }, 
		click: function(event){ self.triggerStats(event); }, 
		mouseup: function(){ self.clearStatTimer(); }, 
		mouseleave: function(){ self.clearStatTimer(); }, 
	  }, 'button.statChange');	  
	  
	  $(document).on({ 
		input: function(event){ self.toggleClear(event); }, 
		change: function(event){ self.toggleClear(event); }, 
	  }, 'input.tw-alike-input');
	  
	  $(document).on('input change', 'input.tw-alike-input, select#selectAreas', function(event) { self.inputsIntervalValidator(event) });
	  
      $(document).on('click', 'span.timebloxing', function(event) { self.intervalTriggerer(event, self) });

	  $(document).on('click', 'span.clear-input', function(event) { self.clearInput(event); });

	  $(document).on('click', 'input.tw-alike-submit', function(event) { self.submitInput(event); });	
	});	
  }

  getIntervals(intervals) {
	this.b != null && clearInterval(this.b);

	this.b = setInterval(() => { this.change(intervals); }, 1000);
	  
	this.change(intervals);
  }
  
  change(intervals){

	let self = this;  

    let $a = $.cookie('tngh') == 2 ? 1 : 2,
     $b = $.cookie('tngh') == 2 ? 2 : 1,
	 $c = $('p#info'),
	 $d = $('div.overflow-limit');
	
	let active = this.active(intervals.data);
	
    this.restrictIntervals.inicio = [];
    this.restrictIntervals.fin = [];
	
	if(intervals.data.intervals_inexistent != 0){
		intervals.data.forEach(intervalo => {
			self.restrictIntervals.inicio.push(intervalo.horaStart.substring(0, 5));
			self.restrictIntervals.fin.push(intervalo.horaEnd.substring(0, 5));
		});		
	}    
	
    if (active !== null && active !== this.a) {	  
	  
	  let isModalOpen = $('#lsModal').length ?
		$('#lsModal') : ($('#fsModal').length ?
		$('#fsModal') : null);
		
	  isModalOpen && $('#lsModal').find('input.ss').length == 0 && isModalOpen.modal('hide');
	  
	  $c.attr({
		  'data-type': '',
		  'data-id': '',
		  'data-name': '',
		  'data-hora-start': '',
		  'data-hora-end': '',
		  'data-id-areas': '',
		  'data-datetime': '',
		  'data-status': ''
		});

	  $('table.timebloxing tbody').hide().fadeIn(500);
	  
	  $('tr[data-content="1"] td span.filter-tag').remove();
	  
	  $('th[data-target="1"]').removeClass('disabled');
	  
	  $('tr[data-content="2"] td span.timebloxing:nth-of-type(2)')
		.addClass('disabled').removeClass('danger');
		
	  $('tr[data-content="2"] td span.timebloxing:nth-of-type(3)')
		.addClass('disabled').removeClass('warning');		  

	  $c.attr({
		  'title': active.name,
		  'data-id': active.id || null,
		  'data-name': active.name,
		  'data-hora-start': active.horaStart,
		  'data-hora-end': active.horaEnd,
		  'data-id-areas': active.idAreas,
		  'data-datetime': active.datetime,
		  'data-status': active.status
		})
	  
	  $('tr[data-content="1"] td div p:nth-of-type(1)')
		.css('text-wrap','nowrap').text(active.name);
		
	  $('span#startHour').text(active.horaStart.substring(0, 5))
		.attr('title', 'Desde las ' + active.horaStart.substring(0, 5) + 'hs.');
		
	  $('span#endHour').text(active.horaEnd.substring(0, 5))
		.attr('title', 'Hasta las ' + active.horaEnd.substring(0, 5) + 'hs.');
	
	  $('th[data-target="'+ $a +'"]')
		.removeClass('disabled').addClass('active');
		
	  $('tr[data-content="'+ $a +'"]')
	    .removeClass('hidden').addClass('active');

      $('th[data-target="'+ $b +'"]').removeClass('active');
	  $('tr[data-content="'+ $b +'"]').removeClass('active').addClass('hidden');	 
	  
	  this.fill(intervals.data);	  

	  JSON.parse(active.idAreas).forEach((id) =>{
		  let index = id >= 6 ? 5 : id <= -1 ? 0 : id;
		  $('tr[data-content="1"] td h1').after(`
			<span class="py-0-25 br-2 fs-7-2 fw-1 d-inline-block px-1 filter-tag sincronizado">
				${this.vectorArea[index][1]}
			</span>
		  `)
	  });
	  
      this.a = active;

	  composite.call('mer', 'getData', 'onload', (active && active.id) || null, (active && active.idAreas) || null);
	  
	  composite.call('fng', 'filterTrigger', $('li.filter-tag.actint'), true, active.name);
	  
	  initToastsPlugin().createToast({
		type: 'system',
		icon: 'info-circle',
		message: `El Intervalo ${active.name} se encuentra activo.`,
		duration: 5000,
	  });
	  
	  let modalOpen = $('#fsModal').length > 0 ?
		$('#fsModal') : ($('#lsModal').length > 0 ?
			$('#lsModal') : null);
	  
	  modalOpen != null && modalOpen.modal('hide');
	  
    } else if (active === null && this.a !== null) {

	  $c.attr({
		  'data-type': '',
		  'data-id': '',
		  'data-name': '',
		  'data-hora-start': '',
		  'data-hora-end': '',
		  'data-id-areas': '',
		  'data-datetime': '',
		  'data-status': '0'
		});
	  
	  $('table.timebloxing tbody').hide().fadeIn(500);

	  $('tr[data-content="1"] td div p:nth-of-type(1)').empty();
	  $('tr[data-content="1"] td div p span#startHour').attr('title', '').empty();	
	  $('tr[data-content="1"] td div p span#endHour').attr('title', '').empty();
	  $('tr[data-content="1"] td h6').nextAll().remove();
	  
	  $('th[data-target="1"]').addClass('disabled').removeClass('active');
	  $('tr[data-content="1"]').removeClass('active').addClass('hidden');	  
	  
	  $('tr th[data-target="2"]').addClass('active');
	  $('tr[data-content="2"]').removeClass('hidden').addClass('active');
	  
	  if(intervals.data.intervals_inexistent == 0){
		  
		$d.empty();
		  
		$d.append(`
			<span class="fs-8 align-middle tw-nw">
				<span class="px-1 fw-4 disabled">No hay intervalos programados.</span>
			</span>
		`);

	  } else this.fill(intervals.data);
	  
	  $('span.timebloxing.danger').removeClass('danger').addClass('disabled');
	  $('span.timebloxing.warning').removeClass('warning').addClass('disabled');
  
      this.a = null;
	  
	  composite.call('fng', 'filterTrigger', $('li.filter-tag.unasigned'), true);
	  
	  composite.call('mer', 'init');
	  
	  initToastsPlugin().createToast({
		type: 'system',
		icon: 'info-circle',
		message: 'No se encuentran intervalos activos.',
		duration: 5000,
	  });	  
    } 
  }
  
  fill(intervals){ 
      $('.table.timebloxing tr[data-content="2"] td div.overflow-limit').empty()
	  
	  intervals.forEach((val, index, array) => {
		  $('.table.timebloxing tr[data-content="2"] td div.overflow-limit').append(`
			<span id="interval-info">
				<span class="text-uppercase fs-8 align-middle tw-nw">
				  <input type="checkbox"
					  data-id="${val.id}" 
					  data-name="${val.name}"
					  data-hora-start="${val.horaStart}"
					  data-hora-end="${val.horaEnd}"
					  data-id-areas="${val.idAreas}"
					  data-datetime="${val.datetime}"
					  class="form-check-input interval py-2" />
				  <span class="px-2 fw-4">${val.name}</span>
				</span>
				<small>(</small>
				  <span class="text-uppercase fs-8 fw-4 text-right">
					${val.horaStart.slice(0, 5)} hs. a ${val.horaEnd.slice(0, 5)} hs.
				  </span>
				<small>)</small>
			<span>
			${index === array.length - 1 ? '' : '<br>'}
		  `);	
	  });  
  }
  
  active(intervals){

	let actual = moment();

    for (let i = 0; i < intervals.length; i++) {
      const inicio = moment(intervals[i].horaStart, 'HH:mm:ss'),
       fin = moment(intervals[i].horaEnd, 'HH:mm:ss');

       if (actual.isBetween(inicio, fin)) return intervals[i];
    }
    return null;
  }

  restrictAreas(idAreas) {
    let resultado = [];
    for (let i = 0; i < idAreas.length; i++) {
        let indice = parseInt(idAreas[i]);
		(indice >= 0 && indice < this.vectorArea.length) && resultado.push(this.vectorArea[indice]);
    }
    return resultado;
  }

  toggleClear(event) {
	let self = event.target || event;

	let $a = $(self).val(),
	 $b = $(self).siblings('.clear-input');

    if ($a.length > 0 || $a) $b.css({'opacity': 1, 'cursor': 'pointer'});
    else $b.css({'opacity': 0, 'cursor': 'text'});	
  }  
  
  reset() {
    this.a = false;
  }

  validator(a, input, mb, val, b) {
    let $a = input.closest('.input-container'),
        $b = $a.find('span#' + input.attr('id') + 'Validation'),
        $c = 'var(--error-validation-color)';

	$a.removeClass(function(index, className) {
		return className.split(' ').filter(function(c) {
			return c !== 'input-container';
		}).join(' ');
	});

    if (a) {
        input.addClass('incorrect');
        input.next('label').css({'color': $c});
        input.css({'border-color': $c});
        $b.hide().fadeIn(300);
        if(b){
            $b.text(val);
            $a.addClass(mb);            
        }
        
    } else {
        input.next('label').css({'color': ''});
        input.css({'border-color': ''});
        $b.fadeOut(500).hide();
        input.removeClass('incorrect');        
        
        !b && $b.text('');
    }
  }

  bucleValidator(valorSeleccionado, horaStartMod, horaEndMod, intervals, doubleActive, b, c) {
    let invalid = false,
     encapsula = false,
     f = null;
	
	const dateCreator = a => new Date("1970-01-01T" + a);
	
    for (let i = 0; i < intervals.inicio.length; i++) {
        let horaInicio = dateCreator(intervals.inicio[i]);
        let horaFin = dateCreator(intervals.fin[i]);

        if ($('input[type="submit"]').hasClass('wg') &&
         (valorSeleccionado >= horaStartMod && valorSeleccionado <= horaEndMod)) continue; 

        if ((valorSeleccionado >= horaInicio && valorSeleccionado <= horaFin) &&
		    (!(horaStartMod <= horaInicio && horaEndMod >= horaFin))) {
			invalid = true;
			f = i;
			break;

        } else if (doubleActive && (b <= horaInicio && c >= horaFin) 
            && !(horaStartMod <= horaInicio && horaEndMod >= horaFin)) {
            encapsula = true;
            f = i;
            break;
        }
    }

    return { invalid, encapsula, f };
  }

  inputsIntervalValidator(event) {
    let self = event.target;

    let invalid = false,
        encapsula = false,
        doubleActive = false,
        f = null;

    const dateCreator = a => new Date("1970-01-01T" + a),
	 mb = e => (e.attr('id') === 'horaStart') ? 'mb-3' : 'mb-23';
	 
    let $a = $('input[type="checkbox"]:checked:not(.type)'),
        $b = dateCreator($('input#horaStart').val() + ':00'),
        $c = dateCreator($('input#horaEnd').val() + ':00'),
        $d = $(self).attr('id') === 'horaStart' ? $('input#horaEnd') : $('input#horaStart');

    if ($(self).attr('id') === 'intervalName') {
		
        if ($(self).val().length > 16) this.validator(true, $(self), 'mb-3', 'Incorrecto, agregá un nombre más corto.', true);
        else this.validator(false, $(self));
		
    } else if ($(self).attr('id') === 'horaStart' || $(self).attr('id') === 'horaEnd') {
        doubleActive = ($b && $c) ? true : false;

        let result = this.bucleValidator(
            dateCreator($(self).val()), 
            dateCreator($a.attr('data-hora-start')), 
            dateCreator($a.attr('data-hora-end')), 
            this.restrictIntervals,
            doubleActive,
            $b,
            $c
        );

        invalid = result.invalid;
        encapsula = result.encapsula;
        f = result.f;
		
        if (invalid) {
            this.validator(true, $(self), mb($(self)),
                'Incorrecto, pisa un intervalo existente de ' +
                this.restrictIntervals.inicio[f] +
                ' a ' +
                this.restrictIntervals.fin[f] +
                '.', true);
        } else if (encapsula) {
            this.validator(true, $(self), mb($(self)),
                'Incorrecto, encapsula un intervalo existente de ' +
                this.restrictIntervals.inicio[f] +
                ' a ' +
                this.restrictIntervals.fin[f] +
                '.', true);
            this.validator(true, $d, null, '', true); 
        } else {
            this.validator(false, $(self)); 

            result = this.bucleValidator(
                dateCreator($d.val()), 
                dateCreator($a.attr('data-hora-start')), 
                dateCreator($a.attr('data-hora-end')), 
                this.restrictIntervals,
                doubleActive,
                $b,
                $c
            );

            invalid = result.invalid;
            f = result.f;

            if (invalid) {
                this.validator(true, $d, mb($d),
                    'Incorrecto, pisa un intervalo existente de ' +
                    this.restrictIntervals.inicio[f] +
                    ' a ' +
                    this.restrictIntervals.fin[f] +
                    '.', true);
            } else this.validator(false, $d);
        }
    } else if ($(self).attr('id') === 'selectAreas') {
        let $a = $(self).next('.ms-parent');
        
        if ($a.find('.ms-drop').find('ul').find('li.selected').length >= 0) {
            $('button.ms-choice').removeClass('selectError');
            $a.next('.placeholder-label').css('color', '');
            
            this.validator(false, $(self));                
        }
    }
  }

  intervalTriggerer(event, global){
	
	let self = event.target,
	 restParameters = [];
	
	this.index = $(self).index();
	
	$('#lsModal').remove();

	let row = this.index,
	 modTitle = $('input[type="checkbox"]:checked:not(.type)');
	
	const titulo = row === 0 ? 'Agregar intervalo' : (row === 2 && modTitle ? 'Modificar ' + modTitle.attr('data-name') : 'Modal desconocido'),
	 color = row === 0 ? 'rgb(25, 135, 84)' : (row === 2 ? 'rgb(223, 170, 8, 1)' : 'rgb(113, 113, 113)'),
	 clase = row === 0 ? 'ss' : (row === 2 ? 'wg' : ""),
	 enviar = row === 0 ? 'Agregar' : (row === 2 ? 'Modificar' : "");		
	
	if (!$(self).hasClass('disabled')) {
		if (row === 0 || row === 2) {

			$('body').append(`
				<div id="lsModal" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
					<div class="modal-dialog modal-dialog-slideout modal-lg" role="document" style="width: 44%;">
						<div class="modal-content" style="width: 100%; height: 100%; border: 3px solid ${color}">
							<div class="modal-header" style="background: ${color}">
								<h1 id="myModalLabel" class="modal-title" style='overflow: hidden; text-overflow: ellipsis; white-space: nowrap;'>
									${titulo}
								</h1>
								<button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
							</div>
							<div class="modal-body">
								<div class="input-container">
									<input type="text" class="tw-alike-input ${clase} mt-4" id="intervalName" placeholder="">
									<label for="intervalName" class="placeholder-label ${clase}">Ingrese el nombre</label>
									<span class="clear-input ${clase}">&#x2715;</span>
									<span id="intervalNameValidation"></span>
								</div>                               
								<div class="input-container">
									<input type="text" class="tw-alike-input ${clase} mt-4" id="horaStart" placeholder=" ">
									<label for="horaStart" class="placeholder-label ${clase}">Ingrese hora inicio</label>
									<span id="horaStartValidation"></span>								
								</div>                               
								<div class="input-container">
									<input type="text" class="tw-alike-input ${clase} mt-4" id="horaEnd" placeholder=" ">
									<label for="horaEnd" class="placeholder-label ${clase}">Ingrese hora final</label>
									<span id="horaEndValidation"></span>								
								</div>                                
								<div class="input-container">
									<select class="${clase}" id="selectAreas" placeholder=" " multiple="multiple">
									  <option value="1">Salúd Física</option>
									  <option value="2">Salúd Mental/Emocional</option>
									  <option value="3">Relaciones Interpersonales</option>									  
									  <option value="4">Carrera/Empleo</option>
									  <option value="5">Desarrollo Financiero</option>
									  <option value="6">Educación/Desarrollo Personal</option>
									</select>
									<label for="selectAreas" class="placeholder-label select ${clase}">Sincronice áreas</label>
									<span id="selectAreasValidation"></span>
								</div>								
								<div class="input-container">
									<input type="submit" class="tw-alike-submit ${clase} mt-4" tabindex="-1"
									  id="enviar${enviar}" 
									  value="${enviar}">
								</div>
							</div>
						</div>
					</div>
				</div>
			`);

			$('.tw-alike-input').each((index, element) => { this.toggleClear($(element)); });
	
			multiselect($('select#selectAreas'));
			this.m = $('select#selectAreas');	
	
			if (row == 2) {
				let $a = $('.overflow-limit').find('input[type="checkbox"]:checked'),
				 $b = this.m;
				
				let nameMod = $a.attr('data-name'),
				 horaStartMod = $a.attr('data-hora-start'),
				 horaEndtMod = $a.attr('data-hora-end'),
				 idAreasMod = JSON.parse($a.attr('data-id-areas'));
				
				$('#intervalName').val(nameMod);
				
				this.toggleClear($('#intervalName'));
				
				$('#horaStart').val(horaStartMod);
				$('#horaEnd').val(horaEndtMod);
				
				idAreasMod.forEach(function(valor) {
					$b.multipleSelect('check', valor + 1);
				});
				
				$b.multipleSelect('open');
			}			
			
			let h = flatpickr(this.restrictIntervals, clase);
			
			$('li input[type="checkbox"]').each((index, input) => { $(input).after(`<span class=${clase}></span>`); });

			$('button.ms-choice').addClass(clase);			
			
			$('#lsModal').modal('show');
			
		} else if (row === 1) {
			let a = [];
			
			let $i = $('small.info');
			
			$('.overflow-limit input:checked').each(function() {
				a.push($(this).data('id'));
				$(this).closest('span#interval-info').remove();
			});
			
			restParameters = ['tng', 'erase', a];
			genericAjax('services/ajax/genericQuery.php', null, function() {
			  composite.call('tng', 'init');
			  $('span.timebloxing:nth-of-type(1)').removeClass('disabled');
			  
			  $i.hasClass('disabled') && $i.removeClass('disabled');

				initToastsPlugin().createToast({
					type: 'success',
					icon: 'check-circle',
					message: 'Se ha borrado el intervalo correctamente.',
					duration: 5000,
				})
			  
			}, function(){
				initToastsPlugin().createToast({
					type: 'error',
					icon: 'exclamation-triangle',
					message: 'Ha ocurrido un error al borrar el intervalo.',
					duration: 5000,
				})
			},...restParameters);
			
		} else return;
	
		$('#lsModal').on('hidden.bs.modal', function (event) { 
		  let self = event.target;

		  $(self).remove();
		  
		  $('div.flatpickr-calendar').remove();
		  
		});			
	}	
  }

  clearInput(event){
	let self = event.target;
	
	let $a = $(self).closest('.input-container').find('.tw-alike-input').attr('id'),
	 $b = $('#'+ $a);	
	
	$(self).siblings('input').val('');
    $(self).css({'opacity': 0, 'cursor': 'text'});
	
	$(self).closest('.input-container').find('input').removeClass('incorrect');
	
	$b.closest('.input-container')
		.removeAttr('style')
		.find('span#'+ $a +'Validation')
		.text('')
		.hide().fadeOut(500);
		
	$b.next('label').css({'color':''});
	$b.css({'border-color':''});

	$(self).closest('.input-container').removeClass(function(index, className) {
	  return className.split(' ').filter(function(c) {
		return c !== 'input-container';
	  }).join(' ');
	});
	
  }

  submitInput(event){
	let $a = $('input#intervalName'),
	 $b = $('input#horaStart'),
	 $c = $('input#horaEnd'),
	 $d = $('select#selectAreas'),
	 $m = $.map(this.m.val(), function(a) { return String(parseInt(a, 10) - 1); }),
	 $i = $('span#interval-info').find('input[type="checkbox"]:checked').attr('data-id');
	 
	let restParameters = [],
	 index = this.index;
	
	if ($('.incorrect').length > 0) $('#intervalNameValidation, #horaStartValidation, #horaEndValidation, #selectAreasValidation').hide().fadeIn();
	else if ($a.val() == '' || $b.val() == '' || $c.val() == '' || this.m.val().length == 0) {
		
		if ($a.val() === '') $a.focus();
        else if ($b.val() === '') $b.focus();
        else if ($c.val() === '') $c.focus();
        else if (this.m.val().length == 0) {
			$d.closest('.input-container').css({'transition':'0.5s ease','margin-bottom':'12px'})
			   .find('span#selectAreasValidation').text('Incorrecto, debés elegir al menos un área.')
			   .hide().fadeIn(300);
			$d.next('label').css({'color':'var(--error-validation-color)'});
			$d.next('.ms-parent').next('.placeholder-label').css({'color':'var(--error-validation-color)'});
			$d.closest('.placeholder-label').css('color','var(--error-validation-color)');
			$d.multipleSelect('close');
			$d.addClass('incorrect');
			
			$('button.ms-choice').addClass('selectError');					
		}
		
	} else {						
		restParameters = [
			'tng',
			index === 0 ? 'create' : (index === 2 ? 'update' : ''),
			'interval',
			$a.val(), $b.val(), $c.val(), $m,
			index == 0 ? '' : (index == 2 ? $i : '')
		 ];
		
		genericAjax('services/ajax/genericQuery.php', null, function() {
		  composite.call('tng', 'init');
		  
		  initToastsPlugin().createToast({
				type: 'success',
				icon: 'check-circle',
				message: `Se ha ${index === 0 ? 'insertado' : (index === 2 ? 'actualizado' : '')} el intervalo correctamente.`,
				duration: 5000,
		  })			  
		}, function(){
		   initToastsPlugin().createToast({
				type: 'error',
				icon: 'exclamation-triangle',
				message: `Hubo un error al ${index === 0 ? 'insertar' : (index === 2 ? 'actualizar' : '')} el intervalo.`,
				duration: 5000,
		   })			
		}, ...restParameters);					
		
		this.m.multipleSelect('uncheckAll');
		
		if (!$d.val() || $d.val().length === 0) {
			$('.placeholder-label').removeClass('focused'); 
			$('.ms-drop').removeClass('open');
		}
		
		$('#intervalName, #horaStart, #horaEnd').val('');
		$('div.input-container:not(:has(.tw-alike-submit))').hide().fadeIn();

		$('.tw-alike-input').each((index, element) => { this.toggleClear($(element)); });				
		
		$('.input-container').removeClass(function(index, className) {
		  return className.split(' ').filter(function(c) {
			return c !== 'input-container';
		  }).join(' ');
		});

		if(index == 2){
			$('#lsModal').modal('hide');
		
			$('span.timebloxing.success').removeClass('disabled');
			
			$('span.filter-tag.timebloxing:nth-of-type(2)')
				.addClass('disabled').removeClass('danger');
				
			$('span.filter-tag.timebloxing:nth-of-type(3)')
				.addClass('disabled').removeClass('warning');
		}
		
		$('#horaStart, #horaEnd').each(function() { 
			const fp = $(this).get(0)._flatpickr;
			fp.setDate('');
			fp.set('maxDate', null);
			fp.set('minDate', null);
		});
		
	}	  
  }

  statTriggerer(event){
	let self = event.target,
		restParameters = [];
	
	let colorIndex = parseInt($(self).attr('data-id-area')) == -1 ? -1 : parseInt($(self).attr('data-id-area')),
	 restrict = $(self).attr('data-id-areas-interval') != 'undefined' ?
		this.restrictAreas($(self).attr('data-id-areas-interval')) :
			this.vectorArea,	
	 tableId = $(self).closest('.table').attr('id'),
	 tableBreedIdEnd = tableId == 'hacer' ? 1 : tableId == 'programar' ?
		2 :
		tableId == 'delegar' ?
			3 : tableId == 'eliminar' ?
				4 : null,
	 dataLevel = $(self).closest('td').find('button.statChange').attr('data-level'),
	 tdId = $(self).prev('.form-check-input').attr('id') || null; 	

	colorIndex = (colorIndex + 1) % restrict.length;

	restParameters = ['mer', 'update', 'stat', restrict[colorIndex][2], dataLevel, tableBreedIdEnd, tdId];
	genericAjax('services/ajax/genericQuery.php', null, function(){		
		$(self).css({'background-color': restrict[colorIndex][0]})
			.attr('data-bs-original-title', restrict[colorIndex][1]);
		
		$(self).tooltip('update').tooltip('show');		
		
		$(self).attr('data-id-area', colorIndex);
		
		composite.call('fng', 'getPercentages');		
		
		initToastsPlugin().createToast({
			type: 'success',
			icon: 'check-circle',
			message: 'Se ha actualizado el área de la tarea.',
			duration: 5000,
		})			
		
	}, function(){
		initToastsPlugin().createToast({
			type: 'error',
			icon: 'exclamation-triangle',
			message: 'Ha ocurrido un error al actualizar el área.',
			duration: 5000,
		})			
	}, ...restParameters);	
  }

  resetStats(event){
	let self = event.target,
	 restParameters = [];
	
	this.y = false;
	
	let dataLevel = $(self).attr('data-level'),
	 tableId = $(self).closest('.table').attr('id'),
	 tableBreedIdEnd = tableId == 'hacer' ? 1 : tableId == 'programar' ?
		2 :
		tableId == 'delegar' ?
			3 : tableId == 'eliminar' ?
				4 : null,
	 tdId = $(self).prev('.form-check-input').attr('id') || null,
	 isDefault = $(self).attr('data-id-area') == -1 ? true : false;
	
    this.x = setTimeout(() => {
		if(!isDefault){
			restParameters = ['mer', 'update', 'stat', -1, dataLevel, tableBreedIdEnd, tdId];
			genericAjax('services/ajax/genericQuery.php', null, function(){
				
				$(self).css('background-color', 'rgb(246 246 246)');
				
				$(self).attr({
					'data-id-area': -1,
					'data-bs-original-title': 'Presione para asignar...',
				});
				
				composite.call('fng', 'getPercentages');
				
				initToastsPlugin().createToast({
					type: 'success',
					icon: 'check-circle',
					message: 'Se ha reseteado el tipo de tarea.',
					duration: 5000,
				})					
				
				$(self).hide().fadeIn(500);
			}, function(){
				initToastsPlugin().createToast({
					type: 'error',
					icon: 'exclamation-triangle',
					message: `Hubo un error al resetear el tipo de tarea.`,
					duration: 5000,
				})
			}, ...restParameters);	
			
		}else $(self).effect("pulsate");
		
		this.y = true;
    }, 1300);	  
  }
  
  triggerStats(event){
	!this.y && this.statTriggerer(event); 
  }  
  
  clearStatTimer(){
	clearTimeout(this.x);
  }
  
}