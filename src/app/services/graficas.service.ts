import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Contenedor } from '../interface/contenedor.interface';

@Injectable({
  providedIn: 'root'
})
export class GraficasService {
  items: Observable<any>;
  public basuras: Contenedor[] = [];
  public data: any[] = [];
  public historico: any[] = [];

  constructor() {}

  dameHistoricoPorBasura(nombreBasura: string) {}

  dameBasuras() {}

  dameBasurasDeZona(zona: string): Observable<Contenedor[]> {
    return null;
  }

  documentToBasura = _ => {
    const object = _.payload.doc.data();
    object.id = _.payload.doc.id;
    return object;
  };
}
