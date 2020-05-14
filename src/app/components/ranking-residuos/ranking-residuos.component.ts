import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
  // @Input() contenedores: Contenedor[];
  @Output() onLoaded = new EventEmitter<boolean>();

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
  historico: Historico[] = [];

  constructor(private dateService: DatesService, private historicoService: HistoricoService) {
    this.month = this.dateService.getMonth();
    this.year = this.dateService.getYear();
  }

  async ngOnInit() {
    await this.composeGraficas();

    // await this.getHistorico();

    this.composeEstrellas();
    this.composeGraficaResiduos();

    this.loaded = true;
    this.onLoaded.emit(true);
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
        const response = await this.historicoService
          .getHistoricoResiduo(this.dateService.year.from, this.dateService.year.to, residuo.nombre)
          .toPromise();
        const historicoResiduo = response.historicos || [];
        historico = historico.concat(historicoResiduo);
      } finally {
      }
    }

    console.log(historico);
    // this.historico = historico;
  }

  async getHistoricoPorFecha(nombreResiduo: string, from: moment.Moment, to: moment.Moment) {
    let historico: Historico[] = [];

    try {
      const response = await this.historicoService.getHistoricoResiduo(from, to, nombreResiduo).toPromise();
      const historicoResiduo = response.historicos || [];
      historico = historico.concat(historicoResiduo);
    } finally {
    }

    return historico;
  }

  async composeGraficas() {
    const resumenMes: any[] = [];
    const resumenAnio: any[] = [];

    for (const residuo of RESIDUOS) {
      const contenedoresPuntuadosMes = await this.getHistoricoPorFecha(
        residuo.nombre,
        moment().subtract(4, 'week'),
        moment()
      );
      const contenedoresPuntuadosAnio = await this.getHistoricoPorFecha(
        residuo.nombre,
        moment().subtract(12, 'months'),
        moment()
      );

      const historicoResiduoMes = contenedoresPuntuadosMes.filter((x) => x.nombre.includes(residuo.nombre));
      const historicoResiduoAnio = contenedoresPuntuadosAnio.filter((x) => x.nombre.includes(residuo.nombre));

      this.historico = this.historico.concat(historicoResiduoAnio);

      const longitudMes = historicoResiduoMes.length * 5;
      const longitudAnio = historicoResiduoAnio.length * 5;

      const sumaMes = historicoResiduoMes.reduce((prev, current) => prev + current.calificacion, 0);
      const sumaAnio = historicoResiduoAnio.reduce((prev, current) => prev + current.calificacion, 0);

      const calculoMes = (sumaMes * 5) / longitudMes; // sumaMes / (longitudMes * 5);
      const calculoAnio = (sumaAnio * 5) / longitudAnio; // sumaAnio / (longitudAnio * 5);

      const valueMonth = Math.round((calculoMes || 0 + Number.EPSILON) * 100) / 100;
      resumenMes.push({
        nombre: (residuo && residuo.nombre) || '',
        value: valueMonth || 0,
      });

      const valueYear = Math.round((calculoAnio || 0 + Number.EPSILON) * 100) / 100;
      resumenAnio.push({
        nombre: residuo.nombre,
        value: valueYear || 0,
      });
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

  composeEstrellas() {
    const resumenMes: any[] = [];
    const resumenAnio: any[] = [];

    for (const residuo of RESIDUOS) {
      const historicoResiduo = this.historico.filter((x) => x.nombre.includes(residuo.nombre));

      // const contenedoresPuntuados = this.historico.filter((x) => x.calificacion > 0).length;

      if (historicoResiduo.length > 0) {
        // Calculamos la puntuacion de la semana
        const maxPuntuacionSemana =
          historicoResiduo.filter((x) =>
            moment(x.fecha).isBetween(this.dateService.week.from, this.dateService.week.to)
          ).length * 5;

        const calificacionSemana = historicoResiduo
          .filter(
            (x) => x.fecha != null && moment(x.fecha).isBetween(this.dateService.week.from, this.dateService.week.to)
          )
          .reduce((a, b) => a + b.calificacion, 0);
        let puntuacionSemanaPorcentaje = (calificacionSemana * 100) / maxPuntuacionSemana || 0;
        puntuacionSemanaPorcentaje = Math.round((puntuacionSemanaPorcentaje || 0 + Number.EPSILON) * 100) / 100;
        const calificacionSemanaPercent = (puntuacionSemanaPorcentaje * 100) / 5;

        // const calificacionSemanaPercent = Math.round(calificacion * 100);
        // const nivelEstrellaSemana = (calificacionSemanaPercent * 5) / 100;

        // Calculamos la puntuacion del mes
        const maxPuntuacionMes =
          historicoResiduo.filter((x) => moment(x.fecha).isBetween(moment().subtract(4, 'week'), moment())).length * 5; // maxPuntuacionSemana * 4;
        const mediaMes = historicoResiduo
          .filter((x) => moment(x.fecha).isBetween(moment().subtract(4, 'week'), moment()))
          .reduce((a, b) => a + b.calificacion, 0);
        let puntuacionMesPorcentaje = (mediaMes * 100) / maxPuntuacionMes || 0;
        puntuacionMesPorcentaje = Math.round((puntuacionMesPorcentaje || 0 + Number.EPSILON) * 100) / 100;
        let calificacionMes = (puntuacionMesPorcentaje * 5) / 100;
        calificacionMes = Math.round((calificacionMes || 0 + Number.EPSILON) * 100) / 100;

        // Generamos grafica nivelEstrellaMes
        const nivelEstrellaMes: ChartData = {
          labels: [''],
          datasets: [{ data: [calificacionMes] }],
          // chartOptions: this.chartOptionsNiveles,
        };
        // const nivelEstrellaMes = (puntuacionMes * 5) / 100;

        // Calculamos la puntuacion del año
        const maxPuntuacionAnio =
          historicoResiduo.filter((x) => moment(x.fecha).isBetween(moment().subtract(12, 'month'), moment())).length *
          5;
        const mediaAnio = historicoResiduo
          .filter((x) => moment(x.fecha).isBetween(moment().subtract(12, 'month'), moment()))
          .reduce((a, b) => a + b.calificacion, 0);
        let puntuacionAnioPorcentaje = (mediaAnio * 100) / maxPuntuacionAnio || 0;
        puntuacionAnioPorcentaje = Math.round((puntuacionAnioPorcentaje || 0 + Number.EPSILON) * 100) / 100;
        let calificacionAnio = (puntuacionAnioPorcentaje * 5) / 100;
        calificacionAnio = Math.round((calificacionAnio || 0 + Number.EPSILON) * 100) / 100;

        const nivelEstrellaAnio: ChartData = {
          labels: [''],
          datasets: [{ data: [calificacionAnio] }],
          // chartOptions: this.chartOptionsNiveles,
        };
        // const nivelEstrellaAnio = (puntuacionAnio * 5) / 100;

        this.rankingResiduos.push({
          nombre: residuo.nombre,
          imgContenedor: historicoResiduo[0].imgContenedor,
          media: calificacionSemanaPercent,
          nivelEstrellaSemana: Math.ceil(calificacionSemanaPercent),
          nivelEstrellaMes: nivelEstrellaMes, //  Math.ceil(nivelEstrellaMes),
          nivelEstrellaAnio: nivelEstrellaAnio, // Math.ceil(nivelEstrellaAnio)
          chartOptions: this.chartOptionsNiveles,
        });
      }
    }

    // this.resumenMes = {
    //   labels: resumenMes.map((x) => x.nombre),
    //   datasets: [{ data: resumenMes.map((x) => x.value) }],
    // };

    // this.resumenAnio = {
    //   labels: resumenAnio.map((x) => x.nombre),
    //   datasets: [{ data: resumenAnio.map((x) => x.value) }],
    // };

    // console.log(this.resumenMes);
    // console.log(this.resumenAnio);

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
  chartOptions: ChartOptions;
}

interface ProblemasComunes {
  nombre: string;
  dataGrafica: ChartData;
  chartOptions: ChartOptions;
}
