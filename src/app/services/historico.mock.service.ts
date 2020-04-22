import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { HistoricoResponse } from '../interface/historico-response.inteface';
import { Moment } from 'moment';

import { dataHistoricoResiduos } from '../data/data.historicoresiduos';

@Injectable({
  providedIn: 'root'
})
export class HistoricoMockService {
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

  async getHistoricoResiduo(residuo: string = ''): Promise<any> {
    return await new Promise(resolve => {
      const data = dataHistoricoResiduos.filter(x =>
        x.nombre.includes(residuo)
      );
      resolve({
        ok: true,
        historicos: data,
        total: data.length
      });
    });
  }
}
