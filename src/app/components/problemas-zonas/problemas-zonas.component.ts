import { Component, OnInit, Input } from '@angular/core';
import { Contenedor } from 'src/app/interface/contenedor.interface';
import * as moment from 'moment';
import { ZONAS } from 'src/app/data/data.zonas';
import { DatesService } from 'src/app/services/dates.service';
import { ESTADOS } from 'src/app/data/data.estados';
import { Historico } from 'src/app/interface/historico.interface';

import 'array-flat-polyfill';
@Component({
  selector: 'app-problemas-zonas',
  templateUrl: './problemas-zonas.component.html',
  styleUrls: ['./problemas-zonas.component.css']
})
export class ProblemasZonasComponent implements OnInit {
  @Input() contenedores: Contenedor[];

  startMonth: moment.Moment;
  endMonth: moment.Moment;

  zonas: any[] = ZONAS;
  estados: any[] = ESTADOS;
  contenedoresPorZonas: ZonaProblema[] = [];
  ProblemaBueno: Problema;

  resumenMes: any = {
    labels: [],
    datasets: [{ data: [] }]
  };

  resumenAnio: any = {
    labels: [],
    datasets: [{ data: [] }]
  };

  chartOptions = {
    responsive: true,
    aspectRatio: 2
  };

  constructor(private dateService: DatesService) {}

  ngOnInit() {
    const historicosMes = this.contenedores
      .filter(x => x.historico !== undefined)
      .filter(x => x.historico.length > 0)
      .flatMap(x => x.historico)
      .filter(
        (x: Historico) =>
          x.fecha != null && moment(x.fecha).isBetween(this.dateService.month.from, this.dateService.month.to)
      );

    const historicosAnio = this.contenedores
      .filter(x => x.historico !== undefined)
      .filter(x => x.historico.length > 0)
      .flatMap(x => x.historico)
      .filter(
        (x: Historico) =>
          x.fecha != null && moment(x.fecha).isBetween(this.dateService.year.from, this.dateService.year.to)
      );

    const maxPuntuacionZonaMes = historicosMes.reduce((a: number, b: Historico) => a + b.calificacion, 0);

    const maxPuntuacionZonaAnio = historicosAnio.reduce((a: number, b: Historico) => a + b.calificacion, 0);

    this.zonas.map(zona => {
      let nombreZona = `${zona.nombre} - ${zona.area}`;
      const contenedoresZona = this.contenedores.filter(x => x.zona === nombreZona);

      const contenedoresCount = contenedoresZona.length || 0;
      const segregacion = contenedoresZona.reduce((a, b) => a + b.calificacion || 0, 0) / contenedoresCount;
      const segregacionRound: number = Math.floor(segregacion * 100) / 100;

      const historicoContenedoresZonasTemp: Historico[] = [].concat(
        contenedoresZona
          .filter(x => x.historico !== undefined)
          .filter(contenedor => contenedor.historico.length > 0)
          .map(contenedor => contenedor.historico)
      );

      const historicoContenedoresZonas: Historico[] = Array.prototype.concat.apply([], historicoContenedoresZonasTemp);

      let problemas: Problema[] = [];

      this.estados.map(estado => {
        const nombreEstado = estado.nombre;

        const week = historicoContenedoresZonas.filter((x: Historico) => {
          return (
            x.fecha != null &&
            moment(x.fecha).isBetween(this.dateService.week.from, this.dateService.week.to) &&
            x.estado.includes(nombreEstado)
          );
        }).length;

        const month = historicoContenedoresZonas.filter(
          (x: Historico) =>
            x.fecha != null &&
            moment(x.fecha).isBetween(this.dateService.month.from, this.dateService.month.to) &&
            x.estado.includes(nombreEstado)
        ).length;

        const year = historicoContenedoresZonas.filter(
          (x: Historico) =>
            x.fecha != null &&
            moment(x.fecha).isBetween(this.dateService.year.from, this.dateService.year.to) &&
            x.estado.includes(nombreEstado)
        ).length;

        const puntuacionProblema = historicoContenedoresZonas
          .filter(
            (x: Historico) =>
              x.fecha != null &&
              moment(x.fecha).isBetween(this.dateService.month.from, this.dateService.month.to) &&
              x.estado.includes(nombreEstado)
          )
          .reduce((x: number, y: Historico) => x + y.calificacion || 0, 0);

        const puntuacionProblemaPercent = (puntuacionProblema * 100) / maxPuntuacionZonaMes;

        let puntuacion = (puntuacionProblemaPercent * 100) / 5;
        puntuacion = Math.floor(Math.round(puntuacion) / 100);

        const problema: Problema = {
          name: nombreEstado,
          month: month,
          iconosRellenos: Array(5)
            .fill(false)
            .map((x, idx) => {
              return idx < puntuacion;
            }),
          puntuacion: puntuacion || 0,
          week: week,
          year: year
        };

        problemas.push(problema);
      });

      this.ProblemaBueno = problemas.filter(x => x.name == 'Bueno')[0];
      problemas = problemas.filter(x => x.name != 'Bueno');

      // Cambiado según necesidades del cliente - 28/01/2020
      nombreZona.startsWith('Zona 1 -') ? (nombreZona = 'Zona 1 - Manipulación de Materiales') : nombreZona;

      const newZona: ZonaProblema = {
        nombre: nombreZona,
        contenedoresCount: contenedoresCount,
        segregracion: segregacionRound,
        problemas: problemas
      };

      this.contenedoresPorZonas.push(newZona);

      this.resumenMes.labels.push(nombreZona);
      const month = historicoContenedoresZonas
        .filter(
          (x: Historico) =>
            x.fecha != null && moment(x.fecha).isBetween(this.dateService.month.from, this.dateService.month.to)
        )
        .reduce((a: number, b: Historico) => a + b.calificacion, 0);
      this.resumenMes.datasets[0].data.push(Math.ceil(month));

      this.resumenAnio.labels.push(nombreZona);
      const year = historicoContenedoresZonas
        .filter(
          (x: Historico) =>
            x.fecha != null && moment(x.fecha).isBetween(this.dateService.year.from, this.dateService.year.to)
        )
        .reduce((a: number, b: Historico) => a + b.calificacion, 0);
      this.resumenAnio.datasets[0].data.push(Math.ceil(year));
    });
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
