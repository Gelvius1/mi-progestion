export default function flatpickr(restrict, clase) {
	
	let horarios = $("#horaStart, #horaEnd").flatpickr({
		enableTime: true,
		noCalendar: true,
		dateFormat: "H:i",
		defaultDate: null,
		time_24hr: true,
		hourIncrement: 1,
		minuteIncrement: 1,
		enableMousewheel: true,
		onClose: function(selectedDates, dateStr, instance) {
			let isStart = (instance.input.id === "horaStart");
			
			$(`#${instance.input.id}`).closest('.input-container').next('.input-container').css('margin-top', '');
		},
		onOpen: function(selectedDates, dateStr, instance) {
			if (instance.input.id === "horaEnd" && !horarios[0].input.value) {
				setTimeout(() => {
					horarios[0].element.focus();
				}, 200);
				instance.close();
				return;
			}
			
			$('.flatpickr-time').addClass(clase);
			
			let isStart = (instance.input.id === "horaStart") ? ['#horaStart', '40px'] : ['#horaEnd', '60px'];
			$(isStart[0]).closest('.input-container').next('.input-container').css('margin-top', isStart[1]);
		},
		onChange: function(selectedDates, dateStr, instance) {
			if (["horaStart", "horaEnd"].includes(instance.input.id)) {
				let isStart = instance.input.id === "horaStart",
					offset = isStart ? 60000 : -60000,
					e = isStart ? 1 : 0;

				horarios[e].set(isStart ? "minDate" : "maxDate", new Date(selectedDates[0].getTime() + offset));
			}		
		}					
	});
	
	let a = $("#horaStart").val(),
	 b = $("#horaEnd").val();

	let $x = a ? new Date("1970-01-01T" + a + ":00") : null,
	 $y = b ? new Date("1970-01-01T" + b + ":00") : null;

	a && horarios[0].setDate($x);
	b && horarios[1].setDate($y);

	$x && horarios[1].input.value && horarios[1].set("minDate", new Date($x.getTime() + 60000));
	$y && horarios[0].input.value && horarios[0].set("maxDate", new Date($y.getTime() - 60000));

	$x && horarios[1].input.value && $y < new Date($x.getTime() + 60000) && horarios[1].clear();
	$y && horarios[0].input.value && $x > new Date($y.getTime() - 60000) && horarios[0].clear();	
	
}
