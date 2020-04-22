import { Component, OnInit, Input } from '@angular/core';
import { Contenedor } from 'src/app/interface/contenedor.interface';

@Component({
  selector: 'app-residuos-zona',
  templateUrl: './residuos-zona.component.html',
  styleUrls: ['./residuos-zona.component.css']
})
export class ResiduosZonaComponent implements OnInit {

  @Input() contenedores: Contenedor[];

  constructor() { }

  zonas: any[] = [];

  ngOnInit() {

  }

}
