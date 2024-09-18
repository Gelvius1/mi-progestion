import ModeloMatrizEisenhower from './models/matriz-eisenhower-model.js';
import VistaMatrizEisenhower from './views/matriz-eisenhower-view.js';
import ControllerMatrizEisenhower from './controllers/matriz-eisenhower-controller.js';

import ModeloTimebloxing from './models/timebloxing-model.js';
import VistaTimebloxing from './views/timebloxing-view.js';
import ControllerTimebloxing from './controllers/timebloxing-controller.js';

import ModeloFiltering from './models/filtering-model.js';
import VistaFiltering from './views/filtering-view.js';
import ControllerFiltering from './controllers/filtering-controller.js';

const modeloTimebloxing = new ModeloTimebloxing(),
 vistaTimebloxing = new VistaTimebloxing(),
 controllerTimebloxing = new ControllerTimebloxing(modeloTimebloxing, vistaTimebloxing);

const modeloMatrizEisenhower = new ModeloMatrizEisenhower(),
 vistaMatrizEisenhower = new VistaMatrizEisenhower(),
 controllerMatrizEisenhower = new ControllerMatrizEisenhower(modeloMatrizEisenhower, vistaMatrizEisenhower);
 
const modeloFiltering = new ModeloFiltering(),
 vistaFiltering = new VistaFiltering(),
 controllerFiltering = new ControllerFiltering(modeloFiltering, vistaFiltering);

class Composite {
    constructor() {
        this.controllers = [];
    }

    add(controller, mvc) {
        this.controllers.push({ controller, mvc });
    }

    call(mvc, method, ...args) {
        const inst = this.controllers.find(({ mvc: a }) => a === mvc);

        if (!inst) {
            console.error(`No se encontró ningún controlador asociado en ${mvc}`);
            return;
        }

        const { controller } = inst;

        if (typeof controller[method] === 'function') {
            controller[method](...args);
        } else {
            if (typeof controller.vista[method] === 'function') {
                controller.vista[method](...args);
            } else {
                console.error(`Método ${method} no existente en controlador o vista del controlador ${mvc}`);
            }
        }
    }
}

const composite = new Composite();
composite.add(controllerMatrizEisenhower, 'mer');
composite.add(controllerTimebloxing, 'tng');
composite.add(controllerFiltering, 'fng');

export default composite;
