import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { HistoricoResponse } from '../interface/historico-response.inteface';
import { Moment } from 'moment';
import { ResiduosZonaComponent } from '../components/residuos-zona/residuos-zona.component';

@Injectable({
  providedIn: 'root'
})
export class HistoricoService {
  constructor(public httpClient: HttpClient) {}

  getHistorico(from: Moment, to: Moment) {
    let params = new HttpParams();
    params = params.append('fechadesde', from.toISOString());
    params = params.append('fechahasta', to.toISOString());

    return this.httpClient.get<HistoricoResponse>(
      `${environment.baseUrl}historico-entre-fechas`,
      { observe: 'body', params }
    );
  }

  async getHistoricoResiduo(from: Moment, to: Moment, residuo: string = '') {
    let url = `${environment.baseUrl}historico-residuo?fechadesde=${from.format(
      'YYYY-MM-DD'
    )}&fechahasta=${to.format('YYYY-MM-DD')}&desde=0&hasta=999`;
    if (residuo !== '') {
      url = `${url}&residuo=${residuo}`;
    }
    return await this.httpClient.get<HistoricoResponse>(url).toPromise();
  }
}
