export default class ControllerFiltering {
    constructor(modelo, vista) {
        this.modelo = modelo;
        this.vista = vista;
    }

    init() {
        this.getPercentages();
    }
    
    getPercentages(...params) {
        let restParameters = [...params];

        this.modelo.getPercentages(data => {
            this.vista.getPercentages(data);
        }, ...restParameters);
    }
}