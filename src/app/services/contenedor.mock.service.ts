import * as moment from 'moment';
import { of } from 'rxjs';

import { Contenedor } from '../interface/contenedor.interface';
import { dataContenedores } from '../data/data.contenedores.mock';

export class ContenedorMockService {
  contenedores: Contenedor[] = [];
  labelGrafica: string[] = ['Semana', 'Mes', 'Año'];

  week = {
    from: moment('01/07/2019', 'dd/MM/yyyy').startOf('week'),
    end: moment('30/07/2019', 'dd/MM/yyyy').endOf('week')
  };

  month = {
    from: moment('01/07/2019', 'dd/MM/yyyy').startOf('month'),
    to: moment('30/07/2019', 'dd/MM/yyyy').endOf('month')
  };
  8;
  year = {
    from: moment('01/07/2019', 'dd/MM/yyyy').startOf('year'),
    to: moment('30/07/2019', 'dd/MM/yyyy').endOf('year')
  };

  constructor() {
    this.contenedores = dataContenedores;
  }

  getAll(conHistorico: boolean = false) {
    return of(this.contenedores);
  }

  get(id: string) {
    const contenedor = [].concat(this.contenedores.find(x => x.id == id));
    return of(contenedor);
  }
}
