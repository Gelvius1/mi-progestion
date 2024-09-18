import initToastsPlugin from '../../plugins/toasts.js';

export default class ModeloTimebloxing {
  constructor() {
    this.intervals = [];
  }

  getIntervals(callback, ...params) {
    let restParameters = ['tng', 'read', ...params];
    genericAjax(
        './services/ajax/genericQuery.php',
        (response) => {
            this.intervals = response;
            callback(this.intervals);
        },
		null, function(){
			initToastsPlugin().createToast({
				type: 'error',
				icon: 'exclamation-triangle',
				message: 'No se ha podido traer los intervalos',
				duration: 5000,
			})				
		}, ...restParameters
    );
  }
}