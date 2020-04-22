import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ZonaService {
  constructor(public httpClient: HttpClient) {}

  async mejorZonaMes() {
    const url = `${environment.baseUrl}zona-mejor-segregada-mes`;
    return await this.httpClient.get<any>(url).toPromise();
  }
}
