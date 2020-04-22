import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContenedorService } from '../../services/contenedor.service';
import { Contenedor } from '../../interface/contenedor.interface';
import { Historico } from '../../interface/historico.interface';

@Component({
  selector: 'app-mala-segregacion',
  templateUrl: './mala-segregacion.component.html',
  styleUrls: ['./mala-segregacion.component.css']
})
export class MalaSegregacionComponent implements OnInit {
  contendores: Contenedor[];
  historicos: Historico[];
  historicosZonas: Historico[];
  zonaId: string;

  constructor(
    private _contenedorService: ContenedorService,
    private actRoute: ActivatedRoute
  ) {}

  ngOnInit() {

    this.zonaId = this.actRoute.snapshot.paramMap.get('zonaId');

    this._contenedorService.getAll().subscribe(data => {
      this.contendores = data;
    });
  }
}
