import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResiduoService {
  constructor(public httpClient: HttpClient) {}

  async mejorResiduoMes() {
    const url = `${environment.baseUrl}residuo-mejor-segregado-mes`;
    return await this.httpClient.get<any>(url).toPromise();
  }
}
