import { Component, OnInit } from '@angular/core';
import { ContenedorService } from 'src/app/services/contenedor.service';
import { Contenedor } from 'src/app/interface/contenedor.interface';
import { DatesService } from 'src/app/services/dates.service';

@Component({
  selector: 'app-page-test',
  templateUrl: './page-test.component.html',
  styleUrls: ['./page-test.component.css'],
})
export class PageTestComponent implements OnInit {
  contenedores: Contenedor[] = [];
  isLoaded: boolean = false;

  constructor(private _basuraService: ContenedorService, public dateService: DatesService) {}

  ngOnInit(): void {
    this.isLoaded = false;
    this._basuraService.getAll(true).subscribe(async (data: any) => {
      this.contenedores = data;
      this.isLoaded = true;
    });
  }
}
