import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  menu: any = [
    {
      titulo: 'Inicio',
      icono: 'mdi mdi-gauge',
      url: '/dashboard'
    },
    {
      titulo: 'Graficas',
      icono: 'mdi mdi-gauge',
      url: '/graficas'
    }
  ];

  constructor() { }
}
