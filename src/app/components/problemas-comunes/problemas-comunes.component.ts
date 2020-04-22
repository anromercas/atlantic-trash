import { Component, OnInit, Input } from '@angular/core';
import { Contenedor } from 'src/app/interface/contenedor.interface';
import { Zona } from 'src/app/interface/zona.interface';

@Component({
  selector: 'app-problemas-comunes',
  templateUrl: './problemas-comunes.component.html',
  styleUrls: ['./problemas-comunes.component.css']
})
export class ProblemasComunesComponent implements OnInit {
  @Input() contenedores: Contenedor[];

  zonas: Zona[] = [];
  problemasComunes: ProblemaComunData[] = [];

  constructor() {}

  ngOnInit() {
    const problemas = new Set(
      this.contenedores
        .filter(x => x.estado != null)
        .map(a => a.estado.replace(',', '').trim())
    );

    problemas.forEach(nombre => {
      const cuantos = this.contenedores.filter(contenedor =>
        nombre.includes(contenedor.estado)
      ).length;
      this.problemasComunes.push({
        nombre: nombre,
        cuantos
      });

      this.problemasComunes
        .sort((a, b) =>
          a.cuantos > b.cuantos ? -1 : b.cuantos > a.cuantos ? 1 : 0
        )
        .filter(a => a.nombre !== '');
    });
  }
}

interface ProblemaComunData {
  nombre: string;
  cuantos: number;
}
