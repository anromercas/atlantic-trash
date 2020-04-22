import { Component, OnInit } from '@angular/core';
import { ContenedorService } from 'src/app/services/contenedor.service';
import { Contenedor } from '../../interface/contenedor.interface';

@Component({
  selector: 'app-listado-zonas',
  templateUrl: './listado-zonas.component.html',
  styles: []
})
export class ListadoZonasComponent implements OnInit {
  zonas: any[] = [];

  constructor(private _contenedorService: ContenedorService) {}

  ngOnInit() {
    this._contenedorService.getAll().subscribe((data: Contenedor[]) => {
      const basuras: Contenedor[] = data;
      const zonasSet = new Set(basuras.filter(x => x.zona != '').map(x => x.zona));
      const zonas = Array.from(zonasSet);

      zonas.forEach(zona => {
        const puntuacion = basuras.filter(x => x.zona == zona).reduce((a, b) => a + b.calificacion, 0) || 0;

        // Cambiado según necesidades del cliente - 28/01/2020
        const nombre = zona.startsWith('Zona 1 -') ? (zona = 'Zona 1 - Manipulación de Materiales') : zona;

        this.zonas.push({
          zona: nombre.split(' - ')[0],
          area: nombre.split(' - ')[1],
          puntuacion
        });
      });
    });
  }
}
