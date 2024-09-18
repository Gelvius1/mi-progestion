export default class modeloMatrizEisenhower {
  constructor() {
    this.data = [];
  }

  getData(callback, ...params) {
    let restParameters = ['mer', 'read', ...params];
    genericAjax(
        './services/ajax/genericQuery.php',
        (response) => {
            this.data = response;
            callback(this.data);
        },
		null, function(){
			initToastsPlugin().createToast({
				type: 'error',
				icon: 'exclamation-triangle',
				message: 'No se ha podido traer las tareas',
				duration: 5000,
			})				
		},...restParameters
    );
  }

}