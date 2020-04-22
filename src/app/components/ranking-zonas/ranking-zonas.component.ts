import { Component, OnInit, Input } from '@angular/core';
import { Contenedor } from 'src/app/interface/contenedor.interface';
import * as moment from 'moment';
import { DatesService } from 'src/app/services/dates.service';
import { ChartData } from 'chart.js';

@Component({
  selector: 'app-ranking-zonas',
  templateUrl: './ranking-zonas.component.html',
  styleUrls: ['./ranking-zonas.component.css']
})
export class RankingZonasComponent implements OnInit {
  @Input() contenedores: Contenedor[];

  zonas: RankinZonaData[] = [];

  month: any;
  year: any;

  chartPuntuacionMensual: ChartData;
  chartOptionsPuntuacionMensual = {
    responsive: true,
    aspectRatio: 2,
    scales: {
      xAxes: [
        {
          ticks: {
            beginAtZero: true,
            max: 5
          }
        }
      ]
    }
  };

  chartPuntuacionAnual: ChartData;
  chartOptionsPuntuacionAnual = {
    responsive: true,
    aspectRatio: 2,
    scales: {
      xAxes: [
        {
          ticks: {
            beginAtZero: true,
            max: 5
          }
        }
      ]
    }
  };

  chartColorsNiveles = [
    {
      backgroundColor: ['#7ed321']
    }
  ];

  chartOptionsNiveles = {
    responsive: true,
    aspectRatio: 6,
    scales: {
      xAxes: [
        {
          ticks: {
            beginAtZero: true,
            max: 5
          }
        }
      ]
    }
  };

  constructor(private dateService: DatesService) {
    this.month = this.dateService.getMonth();
    this.year = this.dateService.getYear();
  }

  ngOnInit() {
    const zonasSet = new Set(
      this.contenedores
        .filter(x => x.zona !== '')
        .filter(x => x.historico)
        .map(x => x.zona)
    );
    const zonasArray = Array.from(zonasSet);

    zonasArray.forEach(nombre => {
      // console.log(nombre);
      const contenedoresZona = this.contenedores.filter(x => x.zona === nombre);

      const contenedoresCount = contenedoresZona.length || 0;

      const puntuacion = contenedoresZona.reduce((a, b) => a + b.calificacion || 0, 1);

      const historicoContenedoresZonasTemp = [].concat(
        contenedoresZona
          .filter(contenedor => contenedor.historico !== undefined)
          .filter(contenedor => contenedor.historico.length > 0)
          .map(contenedor => contenedor.historico)
      );

      const historicoContenedoresZonas = Array.prototype.concat.apply([], historicoContenedoresZonasTemp);

      const mediaMes = historicoContenedoresZonas
        .filter(x => x.fecha != null && moment(x.fecha).isBetween(this.month.from, this.month.to))
        .reduce((x, y) => x + y.calificacion || 0, 0);

      const mediaAnio = historicoContenedoresZonas
        .filter(x => x.fecha != null && moment(x.fecha).isBetween(this.year.from, this.year.to))
        .reduce((x, y) => x + y.calificacion || 0, 0);

      const maxPuntuacionZonaSemana = contenedoresCount * 5;
      const puntuacionZonaSemana = (puntuacion * 100) / maxPuntuacionZonaSemana;
      const numEstrellaSemana = (puntuacionZonaSemana * 5) / 100;

      const maxPuntuacionZonaMes = contenedoresCount * 5 * 4;
      const puntuacionZonaMes = (mediaMes * 100) / maxPuntuacionZonaMes;

      const nivelEstrellaMes = {
        labels: [''],
        datasets: [{ data: [Math.ceil((puntuacionZonaMes * 5) / 100)] }],
        chartOptions: this.chartOptionsNiveles
      };

      const maxPuntuacionAnio = contenedoresCount * 5 * 4 * 12;
      const puntuacionZonaAnio = (mediaAnio * 100) / maxPuntuacionAnio;

      const nivelEstrellaAnio = {
        labels: [''],
        datasets: [{ data: [Math.ceil((puntuacionZonaAnio * 5) / 100)] }],
        chartOptions: this.chartOptionsNiveles
      };

      // Cambiado según necesidades del cliente - 28/01/2020
      nombre.startsWith('Zona 1 -') ? (nombre = 'Zona 1 - Manipulación de Materiales') : nombre;

      const newzona: RankinZonaData = {
        contenedoresCount: contenedoresCount,
        numeroZona: nombre.split(' - ')[0],
        numeroZonaSafe: nombre
          .split(' - ')[0]
          .toLocaleLowerCase()
          .replace(/ /g, '-'),
        nombre: nombre.split(' - ')[1],
        mediaMes: mediaMes || 0,
        numEstrellaSemana: Math.floor(numEstrellaSemana),
        nivelEstrellaMes: nivelEstrellaMes,
        nivelEstrellaAnio: nivelEstrellaAnio,
        puntuacionZonaMes: mediaMes,
        maxPuntuacionMes: maxPuntuacionZonaMes,
        puntuacionZonaAnio: mediaAnio,
        maxPuntuacionAnio: maxPuntuacionAnio
      };
      this.zonas.push(newzona);
    });

    this.chartPuntuacionMensual = {
      labels: this.zonas.map(x => `${x.numeroZona} - ${x.nombre}`),
      datasets: [
        {
          data: this.zonas.map(x => Math.ceil((x.puntuacionZonaMes * 5) / 100))
        }
      ]
    };

    this.chartPuntuacionAnual = {
      labels: this.zonas.map(x => `${x.numeroZona} - ${x.nombre}`),
      datasets: [
        {
          data: this.zonas.map(x => Math.ceil((x.puntuacionZonaAnio * 5) / 100))
        }
      ]
    };

    this.zonas.sort((a, b) => (a.mediaMes > b.mediaMes ? -1 : b.mediaMes > a.mediaMes ? 1 : 0));
  }

  flatten(arr: any) {
    return arr.reduce(function(flat, toFlatten) {
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
