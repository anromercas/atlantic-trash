import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  get usuario() {
    return JSON.parse(localStorage.getItem('usuario')) || {}
  }

  constructor() { }
}
