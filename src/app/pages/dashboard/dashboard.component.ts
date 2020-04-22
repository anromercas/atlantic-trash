import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Contenedor } from 'src/app/interface/contenedor.interface';

import * as moment from 'moment';
import { Moment } from 'moment';
import { Zona } from 'src/app/interface/zona.interface';
import { ContenedorService } from 'src/app/services/contenedor.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  contenedores: Contenedor[] = [];

  contenedoresCount: number = 0;
  contenedoresValoradosCount: number = 0;
  mejorZonaSemana: Zona;

  now: Moment;

  mejorZonaMes: Zona;
  mesActualStr: string;
  zonas: Zona[];
  rankingResiduos: any[];
  problemasComunes: any;
  isLoaded: boolean = false;

  constructor(
    public router: Router,
    private _basuraService: ContenedorService,
    private _loadingService: LoadingService
  ) {
    moment.locale('es');
    this.now = moment();
  }

  ngOnInit() {
    this.mesActualStr = this.now.format('MMMM');

    this._loadingService.show();
    this._basuraService.getAll(true).subscribe(async (data: any) => {
      setTimeout(() => {
        this.contenedores = data;
        setTimeout(() => {
          this._loadingService.hide();
          this.isLoaded = true;
        }, 1000);
      }, 2000);
    });
  }
}
