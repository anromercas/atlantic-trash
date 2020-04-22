import { Component, OnInit, Input } from '@angular/core';
import { ChartData, ChartDataSets, ChartOptions } from 'chart.js';

import { Contenedor } from 'src/app/interface/contenedor.interface';

import * as moment from 'moment';
import { DatesService } from 'src/app/services/dates.service';
import { HistoricoService } from 'src/app/services/historico.service';
import { Historico } from 'src/app/interface/historico.interface';
import { RESIDUOS } from 'src/app/data/data.residuos';

@Component({
  selector: 'app-ranking-residuos',
  templateUrl: './ranking-residuos.component.html',
  styleUrls: ['./ranking-residuos.component.css'],
})
export class RankingResiduosComponent implements OnInit {
  @Input() contenedores: Contenedor[];
  rankingResiduos: RakingResiduoData[] = [];
  problemasComunes: ProblemasComunes[] = [];
  month: any;
  year: any;

  isLoading: boolean = true;

  chartColors = [
    {
      backgroundColor: ['#FF7360', '#6FC8CE', '#B9E8E0', '#FAFFF2', '#FFFCC4'],
    },
  ];

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

  chartOptionsResumenes = {
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

  resumenMes: any;

  resumenAnio: any;

  loaded: boolean = false;
  historico: Historico[];

  constructor(private dateService: DatesService, private historicoService: HistoricoService) {
    this.month = this.dateService.getMonth();
    this.year = this.dateService.getYear();
  }

  async ngOnInit() {
    await this.getHistorico();
    this.composeEstrellas();
    this.composeGraficaResiduos();
    this.loaded = true;
  }

  tieneProblemasContendor(nombre: string): boolean {
    return this.problemasComunes.filter((x) => x.nombre === nombre).length > 0;
  }

  problemasContendorChartData(nombre: string): any {
    return this.problemasComunes.filter((x) => x.nombre === nombre)[0].dataGrafica;
  }
  problemasContendorChartOptions(nombre: string): ChartOptions {
    return this.problemasComunes.filter((x) => x.nombre === nombre)[0].chartOptions;
  }

  async getHistorico() {
    let historico: Historico[] = [];

    for (const residuo of RESIDUOS) {
      try {
        const response = await this.historicoService.getHistoricoResiduo(
          this.dateService.year.from,
          this.dateService.year.to,
          residuo.nombre
        );
        const historicoResiduo = response.historicos || [];
        historico = historico.concat(historicoResiduo);
      } finally {
      }
    }

    this.historico = historico;
  }

  composeEstrellas() {
    const resumenMes: any[] = [];
    const resumenAnio: any[] = [];

    for (const residuo of RESIDUOS) {
      const historicoResiduo = this.historico.filter((x) => x.nombre.includes(residuo.nombre));

      const contenedoresPuntuados = this.contenedores.filter((x) => x.calificacion > 0).length;

      if (historicoResiduo.length > 0) {
        // Calculamos la puntuacion de la semana
        const maxPuntuacionSemana = this.contenedores.filter((x) => x.nombre.includes(residuo.nombre)).length * 5;
        const calificacionTotal = historicoResiduo
          .filter(
            (x) => x.fecha != null && moment(x.fecha).isBetween(this.dateService.week.from, this.dateService.week.to)
          )
          .reduce((a, b) => a + b.calificacion, 0);
        const calificacion = calificacionTotal / contenedoresPuntuados;
        const calificacionSemanaPercent = Math.round(calificacion * 100);
        const nivelEstrellaSemana = (calificacionSemanaPercent * 5) / 100;

        // Calculamos la puntuacion del mes
        const maxPuntuacionMes = maxPuntuacionSemana * 4;
        const mediaMes = historicoResiduo
          .filter(
            (x) => x.fecha != null && moment(x.fecha).isBetween(this.dateService.month.from, this.dateService.month.to)
          )
          .reduce((a, b) => a + b.calificacion, 0);
        const puntuacionMes = (mediaMes * 100) / maxPuntuacionMes;

        // Generamos grafica nivelEstrellaMes
        const nivelEstrellaMes = {
          labels: [''],
          datasets: [{ data: [Math.ceil((puntuacionMes * 5) / 100)] }],
          chartOptions: this.chartOptionsNiveles,
        };
        // const nivelEstrellaMes = (puntuacionMes * 5) / 100;

        // Calculamos la puntuacion del año
        const maxPuntuacionAnio = maxPuntuacionMes * 12;
        const mediaAnio = historicoResiduo
          .filter(
            (x) => x.fecha != null && moment(x.fecha).isBetween(this.dateService.year.from, this.dateService.year.to)
          )
          .reduce((a, b) => a + b.calificacion, 0);
        const puntuacionAnio = (mediaAnio * 100) / maxPuntuacionAnio;

        const nivelEstrellaAnio = {
          labels: [''],
          datasets: [{ data: [Math.ceil((puntuacionAnio * 5) / 100)] }],
          chartOptions: this.chartOptionsNiveles,
        };
        // const nivelEstrellaAnio = (puntuacionAnio * 5) / 100;

        this.rankingResiduos.push({
          nombre: residuo.nombre,
          imgContenedor: historicoResiduo[0].imgContenedor,
          media: calificacionSemanaPercent,
          nivelEstrellaSemana: Math.ceil(nivelEstrellaSemana),
          nivelEstrellaMes: nivelEstrellaMes, //  Math.ceil(nivelEstrellaMes),
          nivelEstrellaAnio: nivelEstrellaAnio, // Math.ceil(nivelEstrellaAnio)
        });

        resumenMes.push({
          nombre: (residuo && residuo.nombre) || '',
          value: Math.ceil((puntuacionMes * 5) / 100) || 0,
        });

        resumenAnio.push({
          nombre: residuo.nombre,
          value: Math.ceil((puntuacionAnio * 5) / 100) || 0,
        });
      }
    }

    this.resumenMes = {
      labels: resumenMes.map((x) => x.nombre),
      datasets: [{ data: resumenMes.map((x) => x.value) }],
    };

    this.resumenAnio = {
      labels: resumenAnio.map((x) => x.nombre),
      datasets: [{ data: resumenAnio.map((x) => x.value) }],
    };

    this.isLoading = false;
  }

  composeGraficaResiduos() {
    for (const residuo of RESIDUOS) {
      const dataGrafica: ChartData = {
        labels: [],
        datasets: [],
      };

      const historicoResiduo = this.historico.filter((x) => x.nombre.includes(residuo.nombre));

      const problemasResiduo = Array.from(
        new Set(historicoResiduo.flatMap((x) => x.estado.split(',')).filter((x) => x !== ''))
      );

      const residuosResiduo = historicoResiduo.flatMap((x) => x.residuo.split(',')).filter((x) => x !== '');

      let resultadoArray = [];
      for (const problemaResiduo of problemasResiduo) {
        const cantidad = historicoResiduo.filter((x) => x.estado.includes(problemaResiduo)).length;

        const cantidadPercent = Math.floor((cantidad / historicoResiduo.length) * 100);

        resultadoArray.push({
          label: problemaResiduo,
          cantidad: cantidadPercent,
        });
        resultadoArray = resultadoArray
          .sort((a, b) => (a.cantidad > b.cantidad ? -1 : b.cantidad > a.cantidad ? 1 : 0))
          .splice(0, 3);
      }

      dataGrafica.labels = resultadoArray.map((x) => x.label);
      dataGrafica.datasets.push({
        data: resultadoArray.map((x) => x.cantidad),
      });

      this.problemasComunes.push({
        nombre: residuo.nombre,
        dataGrafica: dataGrafica,
        chartOptions: {
          responsive: true,
          aspectRatio: 6,
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                  max: 100,
                },
              },
            ],
            xAxes: [
              {
                ticks: {
                  beginAtZero: true,
                  max: 100,
                },
              },
            ],
          },
        },
      });
    }
  }
}

interface RakingResiduoData {
  nombre: string;
  imgContenedor: string;
  media: number;
  nivelEstrellaSemana: number;
  nivelEstrellaMes: ChartData;
  nivelEstrellaAnio: ChartData;
}

interface ProblemasComunes {
  nombre: string;
  dataGrafica: ChartData;
  chartOptions: ChartOptions;
}
