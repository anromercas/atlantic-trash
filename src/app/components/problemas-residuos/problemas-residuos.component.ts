import { Component, OnInit, Input } from '@angular/core';
import { Contenedor } from 'src/app/interface/contenedor.interface';
import { ESTADOS } from 'src/app/data/data.estados';
import { DatesService } from 'src/app/services/dates.service';
import { Historico } from 'src/app/interface/historico.interface';

import 'array-flat-polyfill';

import * as moment from 'moment';

@Component({
  selector: 'app-problemas-residuos',
  templateUrl: './problemas-residuos.component.html',
  styleUrls: ['./problemas-residuos.component.css']
})
export class ProblemasResiduosComponent implements OnInit {
  @Input() contenedores: Contenedor[];

  estados: any[] = ESTADOS;
  problemasResiduos: Residuo[] = [];
  Problema: Problema;
  ProblemaBueno: Problema;

  resumenMes: {
    labels: string[];
    datasets: any[];
  };
  resumenAnio: {
    labels: string[];
    datasets: any[];
  };

  resumenMesOptions = {
    responsive: true,
    aspectRatio: 1,
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

  resumenAnioOptions = {
    responsive: true,
    aspectRatio: 1,
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

  constructor(private dateService: DatesService) {}

  ngOnInit() {
    const contenedoresSet = new Set(this.contenedores.map(x => x.nombre));

    const resumenMes: any[] = [];
    const resumenAnio: any[] = [];

    const historicosMes = this.contenedores
      .filter(x => x.historico !== undefined)
      .filter(x => x.historico.length > 0)
      .flatMap(x => x.historico)
      .filter(
        (x: Historico) =>
          x.fecha != null &&
          moment(x.fecha).isBetween(
            this.dateService.month.from,
            this.dateService.month.to
          )
      );

    const maxPuntuacionZonaMes = historicosMes.reduce(
      (a: number, b: Historico) => a + b.calificacion,
      0
    );

    contenedoresSet.forEach(contenedorNombre => {
      // Obtenemos los distintos contenedores del mismo tipo
      const listContenedores = this.contenedores.filter(
        (contenedor: Contenedor) => contenedor.nombre === contenedorNombre
      );
      const contenedorImagen: string = listContenedores[0].imgContenedor;

      const historicoResiduosEstados = listContenedores
        .filter(x => x.historico !== undefined)
        .filter(x => x.historico.length > 0)
        .flatMap(x => x.historico);

      let problemas: Problema[] = [];

      this.estados.map(estado => {
        const nombreEstado = estado.nombre;

        const week = historicoResiduosEstados.filter((x: Historico) => {
          return (
            x.fecha != null &&
            moment(x.fecha).isBetween(
              this.dateService.week.from,
              this.dateService.week.to
            ) &&
            x.estado.includes(nombreEstado)
          );
        }).length;

        const month = historicoResiduosEstados.filter(
          (x: Historico) =>
            x.fecha != null &&
            moment(x.fecha).isBetween(
              this.dateService.month.from,
              this.dateService.month.to
            ) &&
            x.estado.includes(nombreEstado)
        ).length;

        const year = historicoResiduosEstados.filter(
          (x: Historico) =>
            x.fecha != null &&
            moment(x.fecha).isBetween(
              this.dateService.year.from,
              this.dateService.year.to
            ) &&
            x.estado.includes(nombreEstado)
        ).length;

        const puntuacionProblema = historicoResiduosEstados
          .filter(
            (x: Historico) =>
              x.fecha != null &&
              moment(x.fecha).isBetween(
                this.dateService.month.from,
                this.dateService.month.to
              ) &&
              x.estado.includes(nombreEstado)
          )
          .reduce((x: number, y: Historico) => x + y.calificacion || 0, 0);

        const puntuacionProblemaPercent =
          (puntuacionProblema * 100) / maxPuntuacionZonaMes || 0;

        let puntuacion = (puntuacionProblemaPercent * 100) / 5;
        puntuacion = Math.floor(Math.round(puntuacion) / 100);

        const problema: Problema = {
          name: nombreEstado,
          month: month,
          iconosRellenos: Array(5)
            .fill(0)
            .map((x, idx) => {
              return idx < puntuacion ? 1 : 0;
            }),
          puntuacion: puntuacion,
          week: week,
          year: year
        };

        problemas.push(problema);
      });

      this.ProblemaBueno = problemas.filter(x => x.name == 'Bueno')[0];
      problemas = problemas.filter(x => x.name != 'Bueno');

      const problemaResiduo = {
        nombre: contenedorNombre.replace(
          /(?:^|(?=[^']).\b)(Contenedor|Cuba|Envases|GRG|de|Cajas|Arcón|Bidón|Sacas|para|Jaula)\b/gi,
          ''
        ),
        imagen: contenedorImagen,
        problemas: problemas
      };

      this.problemasResiduos.push(problemaResiduo);

      const historicoContendoresMes = listContenedores
        .filter(x => x.historico !== undefined)
        .filter(x => x.historico.length > 0)
        .flatMap(x => x.historico)
        .filter(
          (x: Historico) =>
            x.fecha != null &&
            moment(x.fecha).isBetween(
              this.dateService.month.to,
              this.dateService.month.to
            )
        );
      const calificacionMes = historicoContendoresMes.reduce(
        (x, y) => x + y.calificacion,
        0
      );

      resumenMes.push({
        nombre: problemaResiduo.nombre,
        value: Math.ceil((calificacionMes * 5) / 100) || 0
      });

      const historicoContendoresAnio = listContenedores
        .filter(x => x.historico !== undefined)
        .filter(x => x.historico.length > 0)
        .flatMap(x => x.historico)
        .filter(
          (x: Historico) =>
            x.fecha != null &&
            moment(x.fecha).isBetween(
              this.dateService.month.to,
              this.dateService.month.to
            )
        );
      const calificacionAnio = historicoContendoresAnio.reduce(
        (x, y) => x + y.calificacion,
        0
      );

      resumenAnio.push({
        nombre: problemaResiduo.nombre,
        value: Math.ceil((calificacionAnio * 5) / 100) || 0
      });
    });

    this.resumenMes = {
      labels: resumenMes.map(x => x.nombre),
      datasets: [{ data: resumenMes.map(x => x.value) }]
    };

    this.resumenAnio = {
      labels: resumenAnio.map(x => x.nombre),
      datasets: [{ data: resumenAnio.map(x => x.value) }]
    };
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
