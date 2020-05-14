import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Contenedor } from 'src/app/interface/contenedor.interface';
import * as moment from 'moment';
import { ZONAS } from 'src/app/data/data.zonas';
import { DatesService } from 'src/app/services/dates.service';
import { ESTADOS } from 'src/app/data/data.estados';
import { Historico } from 'src/app/interface/historico.interface';

import 'array-flat-polyfill';
import { HistoricoService } from 'src/app/services/historico.service';
@Component({
  selector: 'app-problemas-zonas',
  templateUrl: './problemas-zonas.component.html',
  styleUrls: ['./problemas-zonas.component.css'],
})
export class ProblemasZonasComponent implements OnInit {
  // @Input() contenedores: Contenedor[];
  @Output() onLoaded = new EventEmitter<boolean>();

  startMonth: moment.Moment;
  endMonth: moment.Moment;

  zonas: any[] = ZONAS;
  estados: any[] = ESTADOS;
  contenedoresPorZonas: ZonaProblema[] = [];
  ProblemaBueno: Problema;

  // resumenMes: any = {
  //   labels: [],
  //   datasets: [{ data: [] }],
  // };

  // resumenAnio: any = {
  //   labels: [],
  //   datasets: [{ data: [] }],
  // };

  chartOptions = {
    responsive: true,
    aspectRatio: 2,
  };
  year: { from: moment.Moment; to: moment.Moment };
  month: { from: moment.Moment; to: moment.Moment };
  week: { from: moment.Moment; to: moment.Moment };
  loaded: boolean = false;
  historicos: Historico[] = [];

  constructor(private dateService: DatesService, private historicoService: HistoricoService) {
    this.week = {
      from: moment().startOf('week'),
      to: moment().endOf('week'),
    };

    this.month = {
      from: moment().subtract(4, 'week').startOf('day'),
      to: moment().endOf('day'),
    };

    this.year = {
      from: moment().subtract(12, 'month').startOf('day'),
      to: moment().endOf('day'),
    };
  }

  async ngOnInit() {
    const response = await this.historicoService.getProblemasZonas().toPromise();
    // console.log(response);

    for (let zona of this.zonas) {
      let nombreZona = `${zona.nombre} - ${zona.area}`;

      let problemas: Problema[] = [];

      for (let estado of this.estados) {
        const nombreEstado = estado.nombre;

        const puntuacion = response.mes.filter((x) => x.zona == zona.nombre)[0]['Puntuación Mensual'][nombreEstado];

        const week = response.semana.filter((x) => x.zona == zona.nombre)[0][nombreEstado];
        const month = response.mes.filter((x) => x.zona == zona.nombre)[0][nombreEstado];
        const year = response.año.filter((x) => x.zona == zona.nombre)[0][nombreEstado];

        const problema: Problema = {
          name: nombreEstado,
          iconosRellenos: Array(5)
            .fill(false)
            .map((x, idx) => {
              return idx < Math.round(puntuacion);
            }),
          puntuacion: Math.round(puntuacion) || 0,
          week: week,
          month: month,
          year: year,
        };

        problemas.push(problema);
      }

      this.ProblemaBueno = problemas.filter((x) => x.name == 'Bueno')[0];
      problemas = problemas.filter((x) => x.name != 'Bueno');

      // Cambiado según necesidades del cliente - 28/01/2020
      nombreZona.startsWith('Zona 1 -') ? (nombreZona = 'Zona 1 - Manipulación de Materiales') : nombreZona;

      const contenedoresCount = response.mes.filter((x) => x.zona == zona.nombre)[0]['Total Contenedores Mes'];
      const segregacion = response.mes.filter((x) => x.zona == zona.nombre)[0]['Calidad Segregación'];

      const newZona: ZonaProblema = {
        nombre: nombreZona,
        contenedoresCount: Math.round((contenedoresCount || 0 + Number.EPSILON) * 100) / 100,
        segregracion: Math.round((segregacion || 0 + Number.EPSILON) * 100) / 100,
        problemas: problemas,
      };

      this.contenedoresPorZonas.push(newZona);
    }

    this.loaded = true;
    this.onLoaded.emit(true);
  }
}

interface ZonaProblema {
  nombre: string;
  contenedoresCount: number;
  problemas: Problema[];
  segregracion: number;
}

interface Problema {
  name: string;
  week: number;
  month: number;
  year: number;
  puntuacion: number;
  iconosRellenos: boolean[];
}
