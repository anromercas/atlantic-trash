import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { HistoricoResponse } from '../interface/historico-response.inteface';
import { Moment } from 'moment';

@Injectable({
  providedIn: 'root',
})
export class HistoricoService {
  constructor(public httpClient: HttpClient) {}

  getHistorico(from: Moment, to: Moment) {
    let params = new HttpParams();
    params = params.append('fechadesde', from.toISOString());
    params = params.append('fechahasta', to.toISOString());

    return this.httpClient.get<HistoricoResponse>(`${environment.baseUrl}historico-entre-fechas`, {
      observe: 'body',
      params,
    });
  }

  getHistoricoZona(from: Moment, to: Moment, zona: string = '', estado: string = '') {
    const url = `${environment.baseUrl}historicosPorZona`;
    let params: HttpParams = new HttpParams().set('fechadesde', from.toISOString()).set('fechahasta', to.toISOString());

    if (zona != '') {
      params = params.append('zona', zona);
    }
    if (estado != '') {
      params = params.append('estado', estado);
    }

    return this.httpClient.get<HistoricoResponse>(url, { params });
  }

  getHistoricoResiduo(from: Moment, to: Moment, residuo: string = '', estado: string = '') {
    const url = `${environment.baseUrl}historico-residuo`;

    let params: HttpParams = new HttpParams()
      .set('limite', '0')
      .set('fechadesde', from.toISOString())
      .set('fechahasta', to.toISOString());

    if (residuo != '') {
      params = params.append('residuo', residuo);
    }

    if (estado != '') {
      params = params.append('estado', estado);
    }

    // let url = `${environment.baseUrl}historico-residuo?fechadesde=${from.format(
    //   'YYYY-MM-DD'
    // )}&fechahasta=${to.format('YYYY-MM-DD')}&desde=0&hasta=0`;
    // if (residuo !== '') {
    //   url = `${url}&residuo=${residuo}`;
    // }
    return this.httpClient.get<HistoricoResponse>(url, { params });
  }

  getProblemasZonas() {
    const url = `${environment.baseUrl}problemas-por-zonas`;
    return this.httpClient.get<any>(url);
  }

  getProblemasResiduos() {
    const url = `${environment.baseUrl}problemas-por-residuos`;
    return this.httpClient.get<any>(url);
  }
}
