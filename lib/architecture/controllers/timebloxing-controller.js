export default class ControllerTimebloxing {
  constructor(modelo, vista) {
    this.modelo = modelo;
    this.vista = vista;
  }
  
  init() {
    this.getIntervals('onload');
  }
  
  getIntervals(...params) {
    this.modelo.getIntervals(intervals => {
      this.vista.reset();
      this.vista.getIntervals(intervals);      
    }, ...params);
  }
}