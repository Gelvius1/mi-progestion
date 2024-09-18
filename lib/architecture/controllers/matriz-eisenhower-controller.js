export default class ControllerMatrizEisenhower {
  constructor(modelo, vista) {
    this.modelo = modelo;
    this.vista = vista;
  }

  init() {
    this.getData('onload');
  }
  
  getData(...params) {
	  let restParameters = [...params];
	  this.modelo.getData(data => {
		this.vista.getData(data);
	  }, ...restParameters);
  }
}