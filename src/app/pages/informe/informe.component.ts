import { Component, OnInit } from '@angular/core';
import { NgbDate, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import * as jsPDF from 'jspdf';

import { Historico } from 'src/app/interface/historico.interface';
import { HistoricoService } from 'src/app/services/historico.service';

import { ZONAS } from 'src/app/data/data.zonas';

import { HistoricoResponse } from 'src/app/interface/historico-response.inteface';
import { RESIDUOS } from 'src/app/data/data.residuos';
import { ESTADOS } from 'src/app/data/data.estados';
import { CONTENEDORES } from 'src/app/data/data.contenedores';

@Component({
  selector: 'app-informe',
  templateUrl: './informe.component.html',
  styleUrls: ['./informe.component.css']
})
export class InformeComponent implements OnInit {
  isHistoricoLoaded: boolean = false;
  historicos: Historico[];

  hoveredDate: NgbDate;

  fromDate: NgbDate;
  toDate: NgbDate;

  zonas: any[] = [];
  zonaSelect: any[] = [];

  residuos: any[] = [];
  residuoSelect: any[] = [];

  estados: any[] = [];
  estadoSelect: any[] = [];

  nombres: any[] = [];
  nombresSelect: any[] = [];

  calificacionContendor: number[];

  baseDropdownSettings = {
    singleSelection: false,
    idField: 'item_id',
    textField: 'item_text',
    selectAllText: 'Todas',
    unSelectAllText: 'Ninguna'
    // itemsShowLimit: 3,
    // allowSearchFilter: true
  };
  ticksLabels: string[];

  constructor(private historicoService: HistoricoService, calendar: NgbCalendar) {
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 30);
  }

  ngOnInit() {
    this.zonas = ZONAS.map(x => {
      // Cambiado según necesidades del cliente - 28/01/2020
      const area = x.nombre == 'Zona 1' ? 'Manipulación de Materiales' : x.area;
      return { item_id: x.nombre, item_text: `${x.nombre} - ${area}` };
    });

    this.residuos = RESIDUOS.map(x => {
      return { item_id: x.nombre, item_text: x.nombre };
    });

    this.estados = ESTADOS.map(x => {
      return { item_id: x.nombre, item_text: x.nombre };
    });

    this.nombres = CONTENEDORES.map(x => {
      return { item_id: x.nombre, item_text: x.nombre };
    });

    this.calificacionContendor = [0, 5];
    this.ticksLabels = ['0', '1', '2', '3', '4', '5'];
  }

  loadHistorico() {
    const fromStr = `${this.fromDate.day}/${this.fromDate.month}/${this.fromDate.year}`;
    const toStr = `${this.toDate.day}/${this.toDate.month}/${this.toDate.year}`;
    const from = moment(fromStr, 'DD/MM/YYYY');
    const to = moment(toStr, 'DD/MM/YYYY');

    this.isHistoricoLoaded = false;
    this.historicoService.getHistorico(from, to).subscribe((data: HistoricoResponse) => {
      let historicosData = data.historicos;

      historicosData = data.historicos
        .filter(x => {
          // Filtro zona
          if (this.zonaSelect.length > 0) {
            const zonasAFiltrar: string = this.zonaSelect
              .map(zona => {
                // Cambiado según necesidades del cliente - 28/01/2020
                const item_text =
                  zona.item_id == 'Zona 1'
                    ? 'Zona 1 - Almacén Concentrado / Planta de Muestras / Planta Trituración'
                    : `${zona.item_id} - ${zona.item_text}`;

                return item_text;
              })
              .join(' ');
            return zonasAFiltrar.includes(x.zona);
          }
          return x;
        })
        .filter(x => {
          // Filtro residuo
          if (this.residuoSelect.length > 0) {
            const residuosInContenedor = x.residuo.split(',');
            return this.residuoSelect.some(elem => residuosInContenedor.includes(elem));
          }
          return x;
        })
        .filter(x => {
          // Filtro estado
          if (this.estadoSelect.length > 0) {
            const estadosInContenedor = x.estado.split(',');
            return this.estadoSelect.some(elem => estadosInContenedor.includes(elem));
          }
          return x;
        })
        .filter(x => {
          if (this.nombresSelect.length > 0) {
            const nombresAFiltrar: string = this.nombresSelect.map(nombre => nombre.item_text).join(' ');
            return this.nombresSelect.some(elem => x.nombre.includes(elem));
            // return nombresAFiltrar.includes(x.nombre);
          }
          return x;
        })
        .filter(x => {
          if (this.calificacionContendor) {
            return x.calificacion >= this.calificacionContendor[0] && x.calificacion <= this.calificacionContendor[1];
          }
          return x;
        });

      this.historicos = historicosData;
      this.isHistoricoLoaded = true;
    });
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return (
      this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate)
    );
  }

  isInside(date: NgbDate) {
    return date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || date.equals(this.toDate) || this.isInside(date) || this.isHovered(date);
  }

  imprimir() {
    const pdf = new jsPDF('p', 'pt', 'letter');
    const source = document.querySelector('#tablaHistoricos');

    const margins = {
      top: 80,
      bottom: 60,
      left: 40,
      width: 522
    };
    const specialElementHandlers = {
      // element with id of "bypass" - jQuery style selector
      '#bypassme': () => true
    };

    pdf.fromHTML(
      source, // HTML string or DOM elem ref.
      margins.left, // x coord
      margins.top,
      {
        // y coord
        width: margins.width, // max width of content on PDF
        elementHandlers: specialElementHandlers
      },
      () => {
        // tslint:disable-next-line: max-line-length
        pdf.save(
          `Informe ${this.fromDate.day}/${this.fromDate.month}/${this.fromDate.year}-${this.toDate.day}/${this.toDate.month}/${this.toDate.year}.pdf`
        );
      },
      margins
    );
  }
}
