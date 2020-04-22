import { Component, OnInit, Input } from '@angular/core';
import { ContenedorService } from 'src/app/services/contenedor.service';
import { DatesService } from 'src/app/services/dates.service';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

import 'array-flat-polyfill';

import { Historico } from 'src/app/interface/historico.interface';
import { ESTADOS } from 'src/app/data/data.estados';

@Component({
  selector: 'app-tabla-mala-segregacion',
  templateUrl: './tabla-mala-segregacion.component.html',
  styleUrls: ['./tabla-mala-segregacion.component.css']
})
export class TablaMalaSegregacionComponent implements OnInit {
  // contendores: Contenedor[];
  historicos: Historico[] = [];
  historicosZonas: Historico[] = [];
  zonaPuntuacion: ZonaPuntuacion;

  @Input() zonaId: string;

  constructor(
    private _contenedorService: ContenedorService,
    private _dateService: DatesService
  ) {}

  ngOnInit() {
    this._contenedorService.getAll().subscribe(data => {
      this.historicos = data.flatMap(x => x.historico);
      this.historicosZonas = this.historicos.filter(
        x => x.zona === this.zonaId
      );
    });

    const maxPuntuacionZonaMes = this.historicos.reduce(
      (a: number, b: Historico) => a + b.calificacion,
      0
    );

    const segregaciones: Segregacion[] = [];
    ESTADOS.map(x => x.nombre).forEach(nombreEstado => {
      // semana
      const pointsWeek = this.historicosZonas.filter(
        x =>
          moment(x.fecha).isBetween(
            this._dateService.week.from,
            this._dateService.week.to
          ) && x.estado.includes(nombreEstado)
      ).length;

      // mes
      const pointsMonth = this.historicosZonas.filter(
        x =>
          moment(x.fecha).isBetween(
            this._dateService.month.from,
            this._dateService.month.to
          ) && x.estado.includes(nombreEstado)
      ).length;

      // año
      const pointsYear = this.historicosZonas.filter(
        x =>
          moment(x.fecha).isBetween(
            this._dateService.year.from,
            this._dateService.year.to
          ) && x.estado.includes(nombreEstado)
      ).length;

      // puntuacion problema
      const puntuacionProblema =
        this.historicosZonas
          .filter(
            (x: Historico) =>
              x.fecha != null &&
              moment(x.fecha).isBetween(
                this._dateService.month.from,
                this._dateService.month.to
              ) &&
              x.estado.includes(nombreEstado)
          )
          .reduce((x: number, y: Historico) => x + y.calificacion || 0, 0) || 0;

      const puntuacionProblemaPercent =
        (puntuacionProblema * 100) / maxPuntuacionZonaMes || 0;

      let puntuacion = (puntuacionProblemaPercent * 100) / 5;
      puntuacion = Math.floor(Math.round(puntuacion) / 100);

      const segregacion: Segregacion = {
        nombre: nombreEstado,
        week: pointsWeek,
        month: pointsMonth,
        year: pointsYear,
        puntuacionMonth: puntuacion,
        iconosRellenos: Array(5)
          .fill(false)
          .map((x, idx) => {
            return idx < puntuacion;
          })
      };

      segregaciones.push(segregacion);
    });

    this.zonaPuntuacion = {
      nombre: this.zonaId,
      segregaciones: segregaciones || [],
      points: maxPuntuacionZonaMes
    };
  }
}

interface ZonaPuntuacion {
  nombre: string;
  segregaciones: Segregacion[];
  points: number;
}

interface Segregacion {
  nombre: string;
  week: number;
  month: number;
  year: number;
  puntuacionMonth: number;
  iconosRellenos: boolean[];
}
