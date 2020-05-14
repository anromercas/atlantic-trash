import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Contenedor } from 'src/app/interface/contenedor.interface';
import * as moment from 'moment';
import { DatesService } from 'src/app/services/dates.service';
import { ChartData } from 'chart.js';
import { ZONAS } from 'src/app/data/data.zonas';
import { HttpParams, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-ranking-zonas',
  templateUrl: './ranking-zonas.component.html',
  styleUrls: ['./ranking-zonas.component.css'],
})
export class RankingZonasComponent implements OnInit {
  // @Input() contenedores: Contenedor[];
  @Output() onLoaded = new EventEmitter<boolean>();

  zonas: any[] = [];

  week: { from: moment.Moment; to: moment.Moment };
  month: { from: moment.Moment; to: moment.Moment };
  year: { from: moment.Moment; to: moment.Moment };

  resumenMensualChart: ChartData = {};
  chartOptionsPuntuacionMensual = {
    responsive: true,
    aspectRatio: 2,
    scales: {
      xAxes: [
        {
          ticks: {
            beginAtZero: true,
            max: 5,
          },
        },
      ],
    },
  };

  resumenAnualChart: ChartData = {};
  chartOptionsPuntuacionAnual = {
    responsive: true,
    aspectRatio: 2,
    scales: {
      xAxes: [
        {
          ticks: {
            beginAtZero: true,
            max: 5,
          },
        },
      ],
    },
  };

  chartColorsNiveles = [
    {
      backgroundColor: ['#7ed321'],
    },
  ];

  chartOptionsNiveles = {
    responsive: true,
    aspectRatio: 6,
    scales: {
      xAxes: [
        {
          ticks: {
            beginAtZero: true,
            max: 5,
          },
        },
      ],
    },
  };
  loaded: boolean;

  constructor(private readonly http: HttpClient) {
    this.week = {
      from: moment().startOf('week'),
      to: moment().endOf('week'),
    };
    this.month = {
      from: moment().subtract(4, 'week'),
      to: moment(),
    };
    this.year = {
      from: moment().subtract(12, 'month'),
      to: moment(),
    };
  }

  async ngOnInit() {
    await this.calculateZonas();
    // console.log(this.zonas);
    this.loaded = true;
    this.onLoaded.emit(true);
  }

  async calculateZonas(): Promise<boolean> {
    for (let zona of ZONAS) {
      let nombre = zona.nombre;

      // const contenedoresZona = this.contenedores.filter((x) => x.zona.startsWith(nombre));

      //Calculo el semanal
      let httpParams: HttpParams = new HttpParams()
        .set(`zona`, `${nombre}`)
        .set('fechadesde', `${this.week.from.format('YYYY-MM-DD')}`)
        .set('fechahasta', `${this.week.to.format('YYYY-MM-DD')}`);
      const resultWeek = (await this.http
        .get(`${environment.baseUrl}historicosPorZona`, { params: httpParams })
        .toPromise()) as any;
      const contenedoresWeekCount = resultWeek.total || 0;
      const maxWeekPuntuacion = contenedoresWeekCount * 5;
      const calificacionesWeek = resultWeek.historicos.reduce((a, b) => a + b.calificacion, 0);
      const percentCalificacionWeek = (calificacionesWeek * 100) / maxWeekPuntuacion;
      const estrellasWeek = Math.round(((percentCalificacionWeek * 5) / 100 || 0 + Number.EPSILON) * 100) / 100;

      // console.log(
      //   `Zona: ${nombre}. Rango fecha: ${this.week.from.format('DD/MM/YYYY')} a ${this.week.to.format(
      //     'DD/MM/YYYY'
      //   )}. Contenedores: ${contenedoresWeekCount}. Max Puntuación: ${maxWeekPuntuacion}. Puntuacion: ${calificacionesWeek}. Porcentaje ${percentCalificacionWeek}. Estrellas: ${estrellasWeek}`
      // );

      //Calculo el mensual
      httpParams = new HttpParams()
        .set(`zona`, `${nombre}`)
        .set('fechadesde', `${this.month.from.format('YYYY-MM-DD')}`)
        .set('fechahasta', `${this.month.to.format('YYYY-MM-DD')}`);
      const resultMonth = (await this.http
        .get(`${environment.baseUrl}historicosPorZona`, { params: httpParams })
        .toPromise()) as any;
      const contenedoresMonthCount = resultMonth.total || 0;
      const maxMonthPuntuacion = contenedoresMonthCount * 5;
      const calificacionesMonth = resultMonth.historicos.reduce((a, b) => a + b.calificacion, 0);
      const percentCalificacionMonth = (calificacionesMonth * 100) / maxMonthPuntuacion;
      const estrellasMonth = Math.round(((percentCalificacionMonth * 5) / 100 || 0 + Number.EPSILON) * 100) / 100;

      // console.log(
      //   `Zona: ${nombre}. Rango fecha: ${this.month.from.format('DD/MM/YYYY')} a ${this.month.to.format(
      //     'DD/MM/YYYY'
      //   )}. Contenedores: ${contenedoresMonthCount}. Max Puntuación: ${maxMonthPuntuacion}. Puntuacion: ${calificacionesMonth}. Porcentaje: ${percentCalificacionMonth}. Estrellas: ${estrellasMonth}`
      // );

      //Calculo el anual
      httpParams = new HttpParams()
        .set(`zona`, `${nombre}`)
        .set('fechadesde', `${this.year.from.format('YYYY-MM-DD')}`)
        .set('fechahasta', `${this.year.to.format('YYYY-MM-DD')}`);
      const resultYear = (await this.http
        .get(`${environment.baseUrl}historicosPorZona`, { params: httpParams })
        .toPromise()) as any;
      const contenedoresYearCount = resultYear.total || 0;
      const maxYearPuntuacion = contenedoresYearCount * 5;
      const calificacionesYear = resultYear.historicos.reduce((a, b) => a + b.calificacion, 0);
      const percentCalificacionYear = (calificacionesYear * 100) / maxYearPuntuacion;
      const estrellasYear = Math.round(((percentCalificacionYear * 5) / 100 || 0 + Number.EPSILON) * 100) / 100;

      // console.log(
      //   `Zona: ${nombre}. Rango fecha: ${this.year.from.format('DD/MM/YYYY')} a ${this.year.to.format(
      //     'DD/MM/YYYY'
      //   )}. Contenedores: ${contenedoresYearCount}. Max Puntuación: ${maxYearPuntuacion}. Puntuacion: ${calificacionesYear}. Porcentaje: ${percentCalificacionYear}. Estrellas: ${estrellasYear}`
      // );

      const newZona: any = {
        numeroZonaSafe: nombre.split(' - ')[0].toLocaleLowerCase().replace(/ /g, '-'),
        nombre: `${nombre.replace(' -', '')} - ${zona.area}`,
        estrellasWeek,
        estrellasMonth,
        estrellasYear,
        graficaMes: {
          labels: [''],
          datasets: [{ data: [estrellasMonth] }],
          chartOptions: this.chartOptionsNiveles,
        },
        graficaAnio: {
          labels: [''],
          datasets: [{ data: [estrellasYear] }],
          chartOptions: this.chartOptionsNiveles,
        },
      };

      this.zonas.push(newZona);
    }

    // Genero los datos del resumen mensual
    this.resumenMensualChart.labels = this.zonas.map((x) => x.nombre);
    this.resumenMensualChart.datasets = [{ data: this.zonas.map((x) => x.estrellasMonth) }];

    // Genero los datos del resumen anual
    this.resumenAnualChart.labels = this.zonas.map((x) => x.nombre);
    this.resumenAnualChart.datasets = [{ data: this.zonas.map((x) => x.estrellasYear) }];

    this.zonas.sort((a, b) => (a.estrellasMonth > b.estrellasMonth ? -1 : b.estrellasMonth > a.estrellasMonth ? 1 : 0));

    return true;
  }

  flatten(arr: any) {
    return arr.reduce(function (flat, toFlatten) {
      return flat.concat(Array.isArray(toFlatten) ? this.flatten(toFlatten) : toFlatten);
    }, []);
  }
}

interface RankinZonaData {
  contenedoresCount: number;
  numeroZona: string;
  numeroZonaSafe: string;
  nombre: string;
  mediaMes: number;
  numEstrellaSemana: number;
  nivelEstrellaMes: ChartData;
  nivelEstrellaAnio: ChartData;
  puntuacionZonaMes: number;
  maxPuntuacionMes: number;
  puntuacionZonaAnio: number;
  maxPuntuacionAnio: number;
}
