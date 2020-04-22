import { Component, OnInit, Input } from '@angular/core';
import { Contenedor } from 'src/app/interface/contenedor.interface';
import { ContenedorService } from 'src/app/services/contenedor.service';

@Component({
  selector: 'app-progreso-semana',
  templateUrl: './progreso-semana.component.html',
  styleUrls: ['./progreso-semana.component.css']
})
export class ProgresoSemanaComponent implements OnInit {
  @Input() contenedores: Contenedor[];
  contenedoresCount: number = 0;
  contenedoresValoradosCount: number = 0;

  constructor(private readonly contenedorService: ContenedorService) {}

  ngOnInit() {
    // Contendores totales
    this.contenedoresCount = this.contenedores.length;

    this.contenedorService.getProgresoSemana().subscribe((x: any) => {
      this.contenedoresValoradosCount = x.total;
    });
  }
}
