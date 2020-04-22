import { Component, OnInit, Input } from '@angular/core';

import { Contenedor } from 'src/app/interface/contenedor.interface';
import { DatesService } from 'src/app/services/dates.service';
import { Historico } from 'src/app/interface/historico.interface';
import * as moment from 'moment';
import { ZonaService } from 'src/app/services/zona.service';

@Component({
  selector: 'app-mejor-zona-mes',
  templateUrl: './mejor-zona-mes.component.html',
  styleUrls: ['./mejor-zona-mes.component.css']
})
export class MejorZonaMesComponent implements OnInit {
  @Input() contenedores: Contenedor[];

  nombreMejorZona: string;
  startMonth: moment.Moment;
  endMonth: moment.Moment;
  loaded: boolean = null;
  zona: any = null;

  constructor(
    private dateService: DatesService,
    private readonly zonaService: ZonaService
  ) {
    this.startMonth = moment().startOf('month');
    this.endMonth = moment().endOf('month');
  }

  async ngOnInit() {
    this.loaded = false;

    const zona = await this.zonaService.mejorZonaMes();
    this.nombreMejorZona = zona.mejorZona;

    this.loaded = true;
    // const zonasSet = new Set(
    //   this.contenedores.filter(x => x.zona !== '').map(x => x.zona)
    // );
    // const zonasArray = Array.from(zonasSet);

    // const zonasValoradas = [];
    // zonasArray.forEach(nombre => {
    //   const historicosZonasTemp: Historico[] = Array.prototype.concat.apply(
    //     [],
    //     [
    //       ...this.contenedores
    //         .filter(x => x.historico != null)
    //         .filter(x => x.zona === nombre && x.historico.length > 0)
    //         .map(x => x.historico)
    //     ]
    //   );

    //   // filtro por fecha
    //   const historicosZonas = historicosZonasTemp.filter(x =>
    //     moment(x.fecha).isBetween(this.startMonth, this.endMonth)
    //   );
    //   const puntuacion = historicosZonas.reduce(
    //     (a, b) => a + b.calificacion || 0,
    //     1
    //   );

    //   zonasValoradas.push({
    //     nombre: nombre,
    //     puntuacion
    //   });
    // });

    // zonasValoradas.sort((a, b) =>
    //   a.puntuacion > b.puntuacion ? -1 : b.puntuacion > a.puntuacion ? 1 : 0
    // );

    // zonasValoradas.sort();
  }
}
