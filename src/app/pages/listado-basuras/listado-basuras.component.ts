import { Component, OnInit } from '@angular/core';
import { Contenedor } from 'src/app/interface/contenedor.interface';
import { ContenedorService } from 'src/app/services/contenedor.service';
import { ActivatedRoute } from '@angular/router';
import { Moment } from 'moment';
import { DatesService } from 'src/app/services/dates.service';
import * as moment from 'moment';

@Component({
  selector: 'app-listado-basuras',
  templateUrl: './listado-basuras.component.html',
  styleUrls: ['./listado-basuras.component.css']
})
export class ListadoBasurasComponent implements OnInit {
  contenedores: Contenedor[] = [];
  total: number = 0;
  zonasCount: number = 0;
  clasificadasCount: number = 0;
  from: Moment;
  to: Moment;
  calificadasHoy: number = 0;
  today: Moment;

  constructor(
    private _basuraService: ContenedorService,
    private actRoute: ActivatedRoute,
    private dateService: DatesService
  ) {}

  ngOnInit() {
    this.from = this.dateService.getWeek().from;
    this.to = this.dateService.getWeek().to;

    this.today = this.dateService.todayMoment;

    const zonaId = this.actRoute.snapshot.paramMap.get('zonaId');

    if (zonaId === 'progreso-semana') {
      this._basuraService.getProgresoSemana().subscribe((data: any) => {
        this.contenedores = data.historicos;
        this.calculateData();
      });
    } else {
      this._basuraService.getAll().subscribe((data: any) => {
        if (zonaId == null) {
          this.contenedores = data;
        } else if (zonaId === 'progreso-semana') {
          this.contenedores = data.filter((x: { calificacion: any }) => x.calificacion > 0);
        } else {
          this.contenedores = data.filter((x: { zona: string }) => x.zona == zonaId);
        }

        this.calculateData();
      });
    }
  }

  calculateData() {
    this.total = this.contenedores.length;

    const zonasSet = new Set(this.contenedores.filter(x => x.zona != '').map(x => x.zona));
    this.zonasCount = Array.from(zonasSet).length;

    const clasificadasSet = new Set(this.contenedores.filter(x => x.calificacion > 0).map(x => x.calificacion));
    this.clasificadasCount = Array.from(clasificadasSet).length;

    this.calificadasHoy =
      this.contenedores.filter(x => x.fecha != null).filter(x => moment(x.fecha).isSame(this.dateService.today, 'day'))
        .length || 0;

    // Cambiado según necesidades del cliente - 28/01/2020
    this.contenedores.forEach(x => {
      x.zona.startsWith('Zona 1 -') ? (x.zona = 'Zona 1 - Manipulación de Materiales') : x.zona;
    });
  }
}
