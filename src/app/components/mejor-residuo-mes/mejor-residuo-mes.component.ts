import { Component, OnInit, Input } from '@angular/core';
import { Contenedor } from 'src/app/interface/contenedor.interface';
import { DatesService } from 'src/app/services/dates.service';
import * as moment from 'moment';
import { Historico } from 'src/app/interface/historico.interface';
import { ResiduoService } from 'src/app/services/residuo.service';

@Component({
  selector: 'app-mejor-residuo-mes',
  templateUrl: './mejor-residuo-mes.component.html',
  styleUrls: ['./mejor-residuo-mes.component.css']
})
export class MejorResiduoMesComponent implements OnInit {
  @Input() contenedores: Contenedor[];

  loaded: boolean = null;
  mejorResiduo: any;

  constructor(private readonly residuosService: ResiduoService) {}

  async ngOnInit() {
    this.loaded = false;
    this.mejorResiduo = await this.residuosService.mejorResiduoMes();
    this.loaded = true;

    // // Filtro del historico por fecha
    // // Array.prototype.concat.apply([], historicoContenedoresZonasTemp);
    // let contenedoresTemp: Historico[] = Array.prototype.concat.apply(
    //   [],
    //   this.contenedores
    //     .filter(x => x.historico.length > 0)
    //     .map(x => x.historico)
    // );
    // contenedoresTemp = contenedoresTemp.filter(x =>
    //   moment(x.fecha).isBetween(this.startMonth, this.endtMonth)
    // );

    // // Filtro los distintos residuos
    // let residuosTemp = Array.prototype.concat.apply(
    //   [],
    //   contenedoresTemp
    //     .filter(x => x.residuo != null && x.residuo !== '')
    //     .map(x => x.residuo.split(','))
    // );
    // residuosTemp = residuosTemp.filter((x: string) => x !== '');

    // const residuosSet = new Set(residuosTemp);
    // const residuos = Array.from(residuosSet).filter(x => x !== '');

    // const residuosValorados = [];
    // residuos.forEach(nombre => {
    //   if (nombre) {
    //     const puntuacion = contenedoresTemp.filter(x => x.residuo === nombre)
    //       .length;

    //     residuosValorados.push({
    //       nombre: nombre,
    //       puntuacion
    //     });
    //   } else {
    //     residuosValorados.push({
    //       nombre: nombre,
    //       puntuacion: -1000
    //     });
    //   }
    // });

    // residuosValorados.sort((a, b) =>
    //   a.puntuacion > b.puntuacion ? -1 : b.puntuacion > a.puntuacion ? 1 : 0
    // );

    // residuosValorados.sort();

    // this.mejorResiduoNombre =
    //   (residuosValorados.length > 0 &&
    //     residuosValorados[0].nombre.replace(',', '')) ||
    //   '';
  }
}
