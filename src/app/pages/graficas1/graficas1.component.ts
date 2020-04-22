import { Component, OnInit } from '@angular/core';
import { GraficasService } from '../../services/graficas.service';
import { Observable } from 'rxjs';
import { graficoBasuras } from '../../data/data.graficoBasuras';
import { graficoDonas } from '../../data/data.graficoDonas';


@Component({
  selector: 'app-graficas1',
  templateUrl: './graficas1.component.html',
  styles: []
})
export class Graficas1Component implements OnInit {

  graficoDonas = graficoDonas;

  graficoBasuras = graficoBasuras;

  public chartsConfig: any[] = [];
  public basuras: any[] = [];
  public chartsConf: any[] = [];
  items: Observable<any>;
  labelsDonas: string[] = [];
  dataDonas: number[] = [];

  constructor( public _graficasService: GraficasService ) {
    this.chartsConfig =
    Object.keys(this.graficoBasuras).map( item => {
      return this.graficoBasuras[item];
    });

    this.chartsConf =
    Object.keys(this.graficoDonas).map( item => {
      return this.graficoDonas[item];
    });

    /* _graficasService.dameBasuras()
                    .subscribe( (basuras: any) => {
                      basuras.map( (basura: any) => {
                         if ( basura.calificacion ) {
                           this.labelsDonas.push(basura.nombre);
                           this.dataDonas.push(basura.calificacion);
                          }
                        });
                      }); */

  }

  ngOnInit() {

  }


}
