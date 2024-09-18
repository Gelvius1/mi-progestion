export default function multiselect(m) {	
	let $a = $('.placeholder-label'),
	 $b = '',
	 $c = $('input[type="submit"]');

	m.multipleSelect({
		onOpen: () => {
			if (!$a.hasClass('focused')) {
				$a.addClass('focused');
				$('div.ms-drop').addClass('open');
			}
			$c.closest('.input-container').css('margin-top', '225px');
			$c.removeClass('mt-4').addClass('mt-2');
		},
		onClose: () => {
			let selectedValues = $('#selectAreas').val();
			if (!selectedValues || selectedValues.length === 0) {
				$a.removeClass('focused'); 
				$('div.ms-drop').removeClass('open');
			}
			$c.closest('.input-container').css('margin-top', '');
			$c.removeClass('mt-2').addClass('mt-4');				
		},
		formatAllSelected: () => 'Todo seleccionado',
		formatSelectAll: () => 'Seleccionar todo',
		formatCountSelected: (t, e) => `${t} de ${e} seleccionados`,
		formatNoMatchesFound: () => 'No hay áreas disponibles'
	});
}
