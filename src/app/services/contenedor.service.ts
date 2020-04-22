import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ContenedoresResponse } from '../interface/contenedores-response.interface';
import { Contenedor } from '../interface/contenedor.interface';
import { Zona } from '../interface/zona.interface';

import * as moment from 'moment';
import { HistoricoResponse } from '../interface/historico-response.inteface';

@Injectable({
  providedIn: 'root'
})
export class ContenedorService {
  contenedores: Contenedor[] = [];
  labelGrafica: string[] = ['Semana', 'Mes', 'Año'];

  week = {
    from: moment().startOf('week'),
    to: moment().endOf('week')
  };

  month = {
    from: moment().startOf('month'),
    to: moment().endOf('month')
  };

  year = {
    from: moment().startOf('year'),
    to: moment().endOf('year')
  };

  constructor(private http: HttpClient) {}

  getAll(conHistorico: boolean = false) {
    return this.http
      .get<ContenedoresResponse>(`${environment.baseUrl}basura`)
      .pipe(
        map(response => {
          const contenedores = response.basuras;

          contenedores.forEach(
            x => (x.calificacion = x.calificacion == null ? 0 : x.calificacion)
          );

          if (conHistorico) {
            contenedores.forEach(async x => {
              await this.getHistorico(x.codigoContenedor).subscribe(
                (data: HistoricoResponse) => {
                  x.historico = data.historicos || [];
                }
              );
            });
            this.contenedores = contenedores;
            return contenedores;
          } else {
            contenedores.forEach(x => {
              x.historico = [];
            });
          }

          this.contenedores = contenedores;
          return contenedores;
        })
      );
  }

  get(id: string) {
    return this.http.get(`${environment.baseUrl}basura/${id}`);
  }

  getImage(img: string): Observable<Blob> {
    const url = `${
      environment.baseUrl
    }imagen/basuras/${img}?token=${localStorage.getItem('token')}`;
    return this.http.get(url, { responseType: 'blob' });
  }

  getRankingResiduos() {
    const contenedores = Array<any>();

    const contenedoresSet = new Set(this.contenedores.map(x => x.nombre));
    const contenedoresArray = Array.from(contenedoresSet);

    const contenedoresPuntuados = this.contenedores.filter(
      x => x.calificacion > 0
    ).length;

    contenedoresArray.forEach(contenedor => {
      const contenedoresTipo = this.contenedores.filter(
        x => x.nombre === contenedor
      );
      const { nombre, imgContenedor } = contenedoresTipo[0];

      // Calculamos las medias
      const calificacionTotal = contenedoresTipo
        .filter(x => x.calificacion > 0)
        .reduce((a, b) => a + b.calificacion, 0);
      const calificacion = calificacionTotal / contenedoresPuntuados;
      const calificacionPercent = Math.round(calificacion * 100);
      const nivelEstrellaSemana = (calificacionPercent * 5) / 100;

      const nivelEstrellaMes = Math.floor(Math.random() * 5) + 1;
      const nivelEstrellaAnio = Math.floor(Math.random() * 5) + 1;

      let residuosObject = [];
      contenedoresTipo.forEach(x => {
        if (x.residuo != null) {
          const residuos = x.residuo.split(',');
          residuos
            .filter(y => y !== '')
            .forEach(residuo => {
              const encontrado = residuosObject.find(y => y.nombre === residuo);
              if (encontrado != null) {
                encontrado.cantidad++;
              } else {
                residuosObject.push({
                  nombre: residuo,
                  cantidad: 1
                });
              }
            });
        }
      });
      residuosObject = residuosObject.slice(0, 3);

      // Creamos el objeto con los datos
      contenedores.push({
        nombre: nombre,
        imgContenedor: imgContenedor,
        media: calificacionPercent,
        nivelEstrellaSemana,
        nivelEstrellaMes,
        nivelEstrellaAnio,
        dataGraficaMedia: {
          labels: ['Media'],
          datasets: [
            {
              data: [calificacionPercent],
              backgroundColor: ['#ff9099']
            }
          ]
        },
        dataGraficaResiduos: {
          labels: [...residuosObject.map(x => x.nombre)],
          datasets: [
            {
              data: [...residuosObject.map(x => x.cantidad || 0)]
            }
          ]
        }
      });
    });

    contenedores.sort((a, b) =>
      a.media > b.media ? -1 : b.media > a.media ? 1 : 0
    );

    return contenedores.slice(0, 10);
  }

  getProblemasComunes(): any {}

  getHistorico(codigoContenedor: string) {
    return this.http
      .get<HistoricoResponse>(
        `${environment.baseUrl}historico/${codigoContenedor}`
      )
      .pipe(map(response => response));
  }

  getProgresoSemana() {
    return this.http.get(`${environment.baseUrl}progreso-semana`);
  }
}
