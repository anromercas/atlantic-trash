import { Injectable } from '@angular/core';

import swal from 'sweetalert';
import { Router } from '@angular/router';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Usuario } from '../models/usuario.model';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  get token(): string {
    return localStorage.getItem('token') || '';
  }

  constructor(public router: Router, private http: HttpClient) {}

  changePass(idUser: string, oldPassword: string, newPassword: string) {
    const body = new HttpParams()
      .set('passAnt', oldPassword)
      .set('password', newPassword);

    return this.http.put(
      `${environment.baseUrl}usuario/cambiar-passwd/${idUser}`,
      body.toString(),
      {
        headers: new HttpHeaders().set(
          'Content-Type',
          'application/x-www-form-urlencoded'
        ),
        observe: 'response'
      }
    );
  }

  estaLogueado() {
    return this.token.length > 5 ? true : false;
  }

  loginEmailUser(email: string, pass: string, recordar: boolean = false) {
    if (recordar) {
      localStorage.setItem('email', email);
    } else {
      localStorage.removeItem('email');
    }

    const body = new HttpParams().set('email', email).set('password', pass);

    return this.http.post(`${environment.baseUrl}login`, body.toString(), {
      headers: new HttpHeaders().set(
        'Content-Type',
        'application/x-www-form-urlencoded'
      ),
      observe: 'response'
    });
  }

  loginTwoFactor(user: any, password: string, googleCode: string) {
    const url = `${environment.baseUrl}login`;

    const body = new HttpParams()
      .set('email', user.email)
      .set('password', password);

    const response1 = this.verifyTwoFactor(user, googleCode);
    const response2 = this.http.post(url, body.toString(), {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('x-otp', googleCode)
    });

    return forkJoin([response1, response2]);
  }

  verifyTwoFactor(user: any, googleCode: string) {
    const url = `${environment.baseUrl}login/twofactor/verify/${user._id}`;
    const body = new HttpParams().set('tokenOTP', googleCode);
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/x-www-form-urlencoded'
    );

    return this.http.post(url, body, { headers });
  }

  setupTwoFactor(usuario: any) {
    const url = `${environment.baseUrl}login/twofactor/setup/${usuario._id}`;
    return this.http.post(url, null);
  }

  loginUser(user) {
    if (user.usuario.role === 'ADMIN_ROLE') {
      localStorage.setItem('id', user.usuario._id);
      localStorage.setItem('token', user.token);
      localStorage.setItem('email', user.usuario.email);
      localStorage.setItem('usuario', JSON.stringify(user.usuario));

      this.router.navigate(['/']);
    }
  }

  logoutUser() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
