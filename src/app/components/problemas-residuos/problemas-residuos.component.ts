import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Contenedor } from 'src/app/interface/contenedor.interface';
import { ESTADOS } from 'src/app/data/data.estados';
import { RESIDUOS } from 'src/app/data/data.residuos';
import { DatesService } from 'src/app/services/dates.service';
import { Historico } from 'src/app/interface/historico.interface';

import 'array-flat-polyfill';

import * as moment from 'moment';
import { HistoricoService } from 'src/app/services/historico.service';

@Component({
  selector: 'app-problemas-residuos',
  templateUrl: './problemas-residuos.component.html',
  styleUrls: ['./problemas-residuos.component.css'],
})
export class ProblemasResiduosComponent implements OnInit {
  // @Input() contenedores: Contenedor[];
  @Output() onLoaded = new EventEmitter<boolean>();

  estados: any[] = ESTADOS;
  problemasResiduos: Residuo[] = [];
  Problema: Problema;
  ProblemaBueno: Problema;

  residuoActual: string = '';
  estadoActual: string = '';

  RESIDUOS = RESIDUOS;

  loaded: boolean = false;
  week: { from: moment.Moment; to: moment.Moment };
  month: { from: moment.Moment; to: moment.Moment };
  year: { from: moment.Moment; to: moment.Moment };
  allHistoricos: Historico[];

  constructor(private historicoService: HistoricoService) {
    this.week = {
      from: moment().startOf('week').startOf('day'),
      to: moment().endOf('week').endOf('day'),
    };
    this.month = {
      from: moment().startOf('month').startOf('day'),
      to: moment().endOf('month').endOf('day'),
    };
    this.year = {
      from: moment().subtract(12, 'month').startOf('day'),
      to: moment().endOf('day'),
    };
  }

  async ngOnInit() {
    const response = await this.historicoService.getProblemasResiduos().toPromise();
    console.log(response);

    for (let residuo of this.RESIDUOS) {
      const contenedorNombre = residuo.nombre;
      const contenedorImagen = residuo.img.toLowerCase();

      this.residuoActual = contenedorNombre;

      let problemas: Problema[] = [];

      for (let estado of this.estados) {
        const nombreEstado = estado.nombre;

        this.estadoActual = nombreEstado;

        const week = response.semana.filter((x) => x['Resíduo'] == residuo.nombre)[0][estado.nombre] || 0;
        const month = response.mes.filter((x) => x['Resíduo'] == residuo.nombre)[0][estado.nombre] || 0;
        const year = response.año.filter((x) => x['Resíduo'] == residuo.nombre)[0][estado.nombre] || 0;

        const puntuacion = response.mes.filter((x) => x['Resíduo'] == residuo.nombre)[0]['Puntuación Mensual'][
          estado.nombre
        ];

        const problema: Problema = {
          name: nombreEstado,
          iconosRellenos: Array(5)
            .fill(0)
            .map((x, idx) => {
              return idx < Math.round(puntuacion) ? 1 : 0;
            }),
          puntuacion: Math.round((puntuacion || 0 + Number.EPSILON) * 100) / 100,
          week: week,
          month: month,
          year: year,
        };

        problemas.push(problema);
      }

      this.ProblemaBueno = problemas.filter((x) => x.name == 'Bueno')[0];
      problemas = problemas.filter((x) => x.name != 'Bueno');

      const problemaResiduo = {
        nombre: contenedorNombre.replace(
          /(?:^|(?=[^']).\b)(Contenedor|Cuba|Envases|GRG|de|Cajas|Arcón|Bidón|Sacas|para|Jaula)\b/gi,
          ''
        ),
        imagen: contenedorImagen,
        problemas: problemas,
      };

      this.problemasResiduos.push(problemaResiduo);
    }
    this.loaded = true;
    this.onLoaded.emit(true);
  }
}

interface Residuo {
  nombre: string;
  imagen: string;
  problemas: Problema[];
}

interface Problema {
  name: string;
  week: number;
  month: number;
  year: number;
  puntuacion: number;
  iconosRellenos: number[];
}
