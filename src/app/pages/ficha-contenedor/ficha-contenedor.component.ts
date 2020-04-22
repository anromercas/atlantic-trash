import { Component, OnInit } from '@angular/core';
import { ContenedorService } from 'src/app/services/contenedor.service';
import { Contenedor } from 'src/app/interface/contenedor.interface';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-ficha-contenedor',
  templateUrl: './ficha-contenedor.component.html',
  styleUrls: ['./ficha-contenedor.component.css']
})
export class FichaContenedorComponent implements OnInit {
  basura: Contenedor = null;
  historico: any[] = null;
  id: string;

  imageToShow: any;
  historicoShowed: boolean;

  constructor(
    private route: ActivatedRoute,
    private _contenedorService: ContenedorService,
    private readonly _loadingService: LoadingService
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this._contenedorService.get(this.id).subscribe((data: any) => {
      this.basura = data.basura;

      // Cambiado según necesidades del cliente - 28/01/2020
      this.basura.zona.startsWith('Zona 1 -')
        ? (this.basura.zona = 'Zona 1 - Manipulación de Materiales')
        : this.basura.zona;

      this.imageToShow = `${environment.baseUrl}imagen/basuras/${this.basura.img}`;
    });
  }

  getImagen(urlImage: string) {
    this._contenedorService.getImage(urlImage).subscribe(data => {
      this.createImageFromBlob(data);
    });
  }

  showHistorico() {
    this.getHistorico();
  }
  hideHistorico() {
    this.historico = null;
    this.historicoShowed = false;
  }

  getHistorico() {
    this._contenedorService.getHistorico(this.basura.codigoContenedor).subscribe(async (data: any) => {
      for (let historico of data.historicos) {
        if (historico.img != undefined) {
          historico.hasImage = true;
          historico.imgBlob = `${environment.baseUrl}imagen/basuras/${historico.img}?#${localStorage.getItem('token')}`;
        } else {
          historico.hasImage = false;
          historico.imgBlob = `${environment.baseUrl}imagen/basuras/not-found`;
        }
      }

      this.historico = data.historicos;
      this._loadingService.hide();
      this.historicoShowed = true;
    });
  }

  createImageFromBlob(image: Blob) {
    const reader = new FileReader();
    reader.addEventListener(
      'load',
      () => {
        this.imageToShow = reader.result;
      },
      false
    );

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  openModal(historico: any) {}
}
